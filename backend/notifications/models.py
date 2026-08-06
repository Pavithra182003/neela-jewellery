import uuid

from django.conf import settings
from django.db import models


class Notification(models.Model):
    """An in-app notification for a user — order updates, payment
    events, review moderation, etc. Powers the bell icon in the navbar."""

    class Type(models.TextChoices):
        ORDER_PLACED = "order_placed", "Order Placed"
        ORDER_STATUS = "order_status", "Order Status Update"
        ORDER_CANCELLED = "order_cancelled", "Order Cancelled"
        PAYMENT_SUCCESS = "payment_success", "Payment Success"
        PAYMENT_FAILED = "payment_failed", "Payment Failed"
        REVIEW_APPROVED = "review_approved", "Review Approved"
        GENERAL = "general", "General"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )
    notification_type = models.CharField(max_length=20, choices=Type.choices, default=Type.GENERAL)
    title = models.CharField(max_length=150)
    message = models.TextField()
    link = models.CharField(
        max_length=255, blank=True, null=True,
        help_text="Frontend route to navigate to on click, e.g. /account/orders/NJ-XXXX",
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "is_read"])]
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return f"{self.title} → {self.user}"


class NewsletterSubscriber(models.Model):
    """Email capture for the homepage/footer newsletter form. Deliberately
    separate from User — most subscribers are anonymous visitors, not
    registered accounts."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "newsletter_subscribers"
        ordering = ["-subscribed_at"]
        verbose_name = "Newsletter Subscriber"
        verbose_name_plural = "Newsletter Subscribers"

    def __str__(self):
        return self.email
