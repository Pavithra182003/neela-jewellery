import logging

import razorpay
from django.conf import settings
from django.core.mail import EmailMessage
from django.db import transaction
from rest_framework.exceptions import ValidationError

from orders.models import Order

from .invoicing import generate_invoice_pdf
from .models import Payment
from notifications.services import notify_payment_failed, notify_payment_success

logger = logging.getLogger(__name__)


def _client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


@transaction.atomic
def create_razorpay_order(user, order_number):
    """
    Open a Razorpay order for an existing NEELA order and return the
    details the frontend needs to launch the Razorpay Checkout widget.
    Safe to call again for the same order before payment succeeds
    (e.g. the user closed the widget and retried) — it just updates
    the existing Payment row rather than creating duplicates.
    """
    try:
        order = Order.objects.select_for_update().get(order_number=order_number, user=user)
    except Order.DoesNotExist:
        raise ValidationError({"detail": "Order not found."})

    if order.payment_status == Order.PaymentStatus.PAID:
        raise ValidationError({"detail": "This order has already been paid for."})

    amount_paise = int(order.total_amount * 100)

    client = _client()
    razorpay_order = client.order.create(
        {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": order.order_number,
            "notes": {"order_number": order.order_number, "user_id": str(user.id)},
        }
    )

    payment, _ = Payment.objects.update_or_create(
        order=order,
        defaults={
            "razorpay_order_id": razorpay_order["id"],
            "amount": order.total_amount,
            "currency": "INR",
            "status": Payment.Status.CREATED,
        },
    )

    return {
        "razorpay_order_id": razorpay_order["id"],
        "razorpay_key_id": settings.RAZORPAY_KEY_ID,
        "amount": amount_paise,
        "currency": "INR",
        "order_number": order.order_number,
        "name": "Neela Jewellery",
        "prefill": {
            "name": user.full_name,
            "email": user.email,
            "contact": user.phone_number or "",
        },
    }


@transaction.atomic
def verify_and_capture_payment(user, razorpay_order_id, razorpay_payment_id, razorpay_signature):
    """
    Verify the signature Razorpay Checkout hands back to the frontend
    on success, then mark the payment captured and the order confirmed.
    This is the client-side confirmation path; the webhook (below) is
    the authoritative server-to-server confirmation and will no-op
    here if it already processed the same payment.
    """
    try:
        payment = Payment.objects.select_for_update().select_related("order").get(
            razorpay_order_id=razorpay_order_id, order__user=user
        )
    except Payment.DoesNotExist:
        raise ValidationError({"detail": "No matching payment found for this order."})

    if payment.status == Payment.Status.CAPTURED:
        return payment  # already processed (e.g. by the webhook) — idempotent

    client = _client()
    try:
        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            }
        )
    except razorpay.errors.SignatureVerificationError:
        payment.status = Payment.Status.FAILED
        payment.failure_reason = "Signature verification failed."
        payment.save(update_fields=["status", "failure_reason", "updated_at"])
        raise ValidationError({"detail": "Payment verification failed."})

    _mark_payment_captured(payment, razorpay_payment_id, razorpay_signature)
    return payment


def _mark_payment_captured(payment, razorpay_payment_id, razorpay_signature=None):
    """Shared by both the client-verification path and the webhook path."""
    if payment.status == Payment.Status.CAPTURED:
        return  # idempotent — already handled

    client = _client()
    try:
        remote_payment = client.payment.fetch(razorpay_payment_id)
        method = remote_payment.get("method", "other")
    except Exception:  # pragma: no cover - network/Razorpay outage fallback
        method = "other"

    payment.razorpay_payment_id = razorpay_payment_id
    if razorpay_signature:
        payment.razorpay_signature = razorpay_signature
    payment.status = Payment.Status.CAPTURED
    payment.method = method if method in Payment.Method.values else Payment.Method.OTHER
    payment.save()

    order = payment.order
    order.payment_status = Order.PaymentStatus.PAID
    if order.status == Order.Status.PENDING:
        order.status = Order.Status.CONFIRMED
    order.save(update_fields=["payment_status", "status", "updated_at"])

    try:
        invoice_url = generate_invoice_pdf(order)
        payment.invoice_url = invoice_url
        payment.save(update_fields=["invoice_url"])
    except Exception:
        logger.exception("Invoice generation failed for order %s", order.order_number)
        invoice_url = None

    notify_payment_success(order)
    _send_confirmation_email(order, invoice_url)


def mark_payment_failed(razorpay_order_id, reason=""):
    try:
        payment = Payment.objects.select_related("order").get(razorpay_order_id=razorpay_order_id)
    except Payment.DoesNotExist:
        logger.warning("Received failure for unknown razorpay_order_id=%s", razorpay_order_id)
        return None

    if payment.status == Payment.Status.CAPTURED:
        return payment  # a later success shouldn't be overwritten by a stale failure event

    payment.status = Payment.Status.FAILED
    payment.failure_reason = reason
    payment.save(update_fields=["status", "failure_reason", "updated_at"])

    order = payment.order
    order.payment_status = Order.PaymentStatus.FAILED
    order.save(update_fields=["payment_status", "updated_at"])
    notify_payment_failed(order)
    return payment


def handle_webhook_event(event):
    """
    Process a verified Razorpay webhook payload. Idempotent — safe to
    receive the same event more than once (Razorpay retries on timeout).
    """
    event_type = event.get("event")
    payload = event.get("payload", {}).get("payment", {}).get("entity", {})
    razorpay_order_id = payload.get("order_id")
    razorpay_payment_id = payload.get("id")

    if not razorpay_order_id:
        return

    if event_type == "payment.captured":
        try:
            payment = Payment.objects.select_for_update().get(razorpay_order_id=razorpay_order_id)
        except Payment.DoesNotExist:
            logger.warning("Webhook payment.captured for unknown order_id=%s", razorpay_order_id)
            return
        with transaction.atomic():
            _mark_payment_captured(payment, razorpay_payment_id)

    elif event_type == "payment.failed":
        reason = payload.get("error_description", "Payment failed.")
        mark_payment_failed(razorpay_order_id, reason)


def _send_confirmation_email(order, invoice_url):
    lines = [f"{i.product_name} x{i.quantity} — ₹{i.subtotal}" for i in order.items.all()]
    body = (
        f"Hi {order.user.first_name or order.user.username},\n\n"
        f"Thank you for your order! Here's your confirmation:\n\n"
        f"Order Number: {order.order_number}\n"
        + "\n".join(lines)
        + f"\n\nSubtotal: ₹{order.subtotal}\nDiscount: -₹{order.discount_amount}\n"
        f"Shipping: ₹{order.shipping_charge}\nTax: ₹{order.tax_amount}\n"
        f"Total Paid: ₹{order.total_amount}\n\n"
        f"Shipping to:\n{order.shipping_address.full_name}\n"
        f"{order.shipping_address.address_line1}, {order.shipping_address.city}, "
        f"{order.shipping_address.state} {order.shipping_address.postal_code}\n\n"
        + (f"Download your invoice: {invoice_url}\n\n" if invoice_url else "")
        + "We'll notify you again once your order ships.\n\nWarmly,\nNeela Jewellery"
    )

    email = EmailMessage(
        subject=f"Your Neela Jewellery order {order.order_number} is confirmed",
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[order.user.email],
    )
    email.send(fail_silently=True)
