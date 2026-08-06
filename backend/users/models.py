import uuid

from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models


phone_validator = RegexValidator(
    regex=r"^\+?[0-9]{10,15}$",
    message="Enter a valid phone number (10-15 digits, optional leading +).",
)


class User(AbstractUser):
    """
    Custom user model for Neela Jewellery.

    Extends Django's AbstractUser so `username`/`password`/`is_staff`/
    `is_superuser` etc. keep working out of the box (createsuperuser,
    admin login, permissions). Email is enforced unique because it is
    used for password-reset and order-confirmation emails, and will be
    used as the primary login identifier by the auth serializers built
    in Module 3.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(
        max_length=17, validators=[phone_validator], blank=True, null=True
    )
    date_of_birth = models.DateField(blank=True, null=True)
    profile_image = models.ImageField(
        upload_to="users/profile_images/", blank=True, null=True
    )
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ["email"]

    class Meta:
        db_table = "users"
        ordering = ["-created_at"]
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email or self.username

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username


class Address(models.Model):
    """A saved shipping/billing address belonging to a user."""

    class AddressType(models.TextChoices):
        HOME = "home", "Home"
        WORK = "work", "Work"
        OTHER = "other", "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="addresses"
    )
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=17, validators=[phone_validator])
    address_type = models.CharField(
        max_length=10, choices=AddressType.choices, default=AddressType.HOME
    )
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    landmark = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    country = models.CharField(max_length=100, default="India")
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "addresses"
        ordering = ["-is_default", "-created_at"]
        verbose_name = "Address"
        verbose_name_plural = "Addresses"

    def __str__(self):
        return f"{self.full_name} — {self.city}, {self.state} ({self.postal_code})"

    def save(self, *args, **kwargs):
        # Ensure only one default address per user.
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).exclude(
                pk=self.pk
            ).update(is_default=False)
        super().save(*args, **kwargs)
