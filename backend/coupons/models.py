import uuid

from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


class Coupon(models.Model):
    """A discount code that can be applied at checkout."""

    class DiscountType(models.TextChoices):
        PERCENTAGE = "percentage", "Percentage"
        FIXED = "fixed", "Fixed Amount"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=30, unique=True)
    description = models.CharField(max_length=255, blank=True, null=True)

    discount_type = models.CharField(
        max_length=10, choices=DiscountType.choices, default=DiscountType.PERCENTAGE
    )
    discount_value = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    min_purchase_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)]
    )
    max_discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True,
        validators=[MinValueValidator(0)],
    )

    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField()

    usage_limit = models.PositiveIntegerField(
        default=0, help_text="0 = unlimited total uses"
    )
    used_count = models.PositiveIntegerField(default=0)
    per_user_limit = models.PositiveIntegerField(
        default=1, help_text="Max times a single user may use this coupon"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "coupons"
        ordering = ["-created_at"]
        verbose_name = "Coupon"
        verbose_name_plural = "Coupons"

    def __str__(self):
        return self.code

    def save(self, *args, **kwargs):
        self.code = self.code.upper().strip()
        super().save(*args, **kwargs)

    @property
    def is_valid_now(self):
        now = timezone.now()
        if not self.is_active:
            return False
        if not (self.valid_from <= now <= self.valid_until):
            return False
        if self.usage_limit and self.used_count >= self.usage_limit:
            return False
        return True

    def calculate_discount(self, order_amount):
        """Return the discount amount (Decimal) for a given order subtotal."""
        if order_amount < self.min_purchase_amount:
            return 0
        if self.discount_type == self.DiscountType.PERCENTAGE:
            discount = order_amount * (self.discount_value / 100)
            if self.max_discount_amount:
                discount = min(discount, self.max_discount_amount)
        else:
            discount = self.discount_value
        return min(discount, order_amount)
