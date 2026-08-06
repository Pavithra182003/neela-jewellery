import uuid

from django.db import models

from orders.models import Order


class Payment(models.Model):
    """
    Razorpay payment record linked 1:1 to an Order. Populated in two
    steps: a `created` row when the Razorpay order is opened on the
    frontend, then updated with payment_id/signature/status once
    Razorpay's webhook or the client-side handler confirms payment.
    """

    class Status(models.TextChoices):
        CREATED = "created", "Created"
        AUTHORIZED = "authorized", "Authorized"
        CAPTURED = "captured", "Captured"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    class Method(models.TextChoices):
        CARD = "card", "Card"
        UPI = "upi", "UPI"
        NETBANKING = "netbanking", "Netbanking"
        WALLET = "wallet", "Wallet"
        COD = "cod", "Cash on Delivery"
        OTHER = "other", "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, related_name="payment"
    )

    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default="INR")
    method = models.CharField(max_length=20, choices=Method.choices, default=Method.OTHER)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CREATED)

    failure_reason = models.CharField(max_length=255, blank=True, null=True)
    invoice_url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payments"
        ordering = ["-created_at"]
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
        indexes = [
            models.Index(fields=["razorpay_order_id"]),
            models.Index(fields=["razorpay_payment_id"]),
        ]

    def __str__(self):
        return f"Payment for {self.order.order_number} — {self.status}"
