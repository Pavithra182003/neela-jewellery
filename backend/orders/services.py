from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from django.conf import settings
from django.core.mail import send_mail
from cart.models import Cart
from coupons.services import validate_coupon_for_user
from notifications.services import notify_order_placed, notify_order_status_change
from products.models import Product
from users.models import Address

from .models import Order, OrderItem

# ------------------------------------------------------------------
# Checkout business rules. Kept as plain constants here rather than
# settings.py because they're order-domain specific; move to a
# PricingRule model later if these ever need to be admin-editable.
# ------------------------------------------------------------------
TAX_RATE = Decimal("0.03")  # 3% GST, standard rate for jewelry in India
FREE_SHIPPING_THRESHOLD = Decimal("5000.00")
STANDARD_SHIPPING_CHARGE = Decimal("0.00")

CANCELLABLE_STATUSES = {Order.Status.PENDING, Order.Status.CONFIRMED, Order.Status.PROCESSING}


def _calculate_shipping(subtotal):
    if subtotal >= FREE_SHIPPING_THRESHOLD:
        return Decimal("0.00")
    return STANDARD_SHIPPING_CHARGE


def _apply_coupon(coupon_code, subtotal, user):
    """Thin wrapper around coupons.services.validate_coupon_for_user —
    checkout needs the coupon row LOCKED for the duration of the order
    transaction (lock=True), unlike the cart-page preview endpoint."""
    if not coupon_code:
        return None, Decimal("0.00")
    return validate_coupon_for_user(coupon_code, subtotal, user, lock=True)

def send_customer_email(order):
    subject = f"Order Confirmed - {order.order_number}"

    message = f"""
Dear {order.shipping_address.full_name},

Thank you for shopping with Neela Jewellery.

Your order has been placed successfully.

Order Number: {order.order_number}

Total Amount: ₹{order.total_amount}

Payment Method: {order.get_payment_method_display()}

We will notify you once your order is shipped.

Thank you for shopping with us!

Neela Jewellery
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=True,
    )


def send_owner_email(order):
    subject = f"New Order Received - {order.order_number}"

    message = f"""
A new customer has placed an order.

Order Number : {order.order_number}

Customer Name : {order.shipping_address.full_name}

Customer Email : {order.user.email}

Phone Number : {order.shipping_address.phone_number}

Payment Method : {order.get_payment_method_display()}

Total Amount : ₹{order.total_amount}

Please login to the Admin Dashboard to process the order.

Neela Jewellery
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [settings.OWNER_EMAIL],
        fail_silently=True,
    )

def send_payment_received_email(order):
    send_mail(
        "Payment Received - Neela Jewellery",
        f"""
Dear {order.shipping_address.full_name},

We have successfully received your payment.

━━━━━━━━━━━━━━━━━━━━━━

Order Number : {order.order_number}

Amount Paid : ₹{order.total_amount}

Payment Status : Paid

━━━━━━━━━━━━━━━━━━━━━━

Your payment has been verified successfully.

Thank you for shopping with Neela Jewellery.

Regards,
Neela Jewellery Team
""",
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=False,
    )

def send_confirmed_email(order):
    send_mail(
        "Your Order Has Been Confirmed",
        f"""
Dear {order.shipping_address.full_name},

Your order has been confirmed.

Order Number : {order.order_number}

Status : Confirmed

We have started preparing your order.

Regards,
Neela Jewellery Team
""",
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=False,
    )

def send_processing_email(order):
    send_mail(
        "Your Order is Being Prepared",
        f"""
Dear {order.shipping_address.full_name},

Your order is currently under processing.

Order Number : {order.order_number}

Regards,
Neela Jewellery Team
""",
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=False,
    )

def send_shipped_email(order):
    send_mail(
        "Your Order Has Been Shipped",
        f"""
Dear {order.shipping_address.full_name},

Great News!

Your order has been shipped.

Order Number : {order.order_number}

Tracking Number : {order.tracking_number}

Regards,
Neela Jewellery Team
""",
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=False,
    )

def send_delivered_email(order):
    send_mail(
        "Your Order Has Been Delivered",
        f"""
Dear {order.shipping_address.full_name},

Your order has been delivered successfully.

Order Number : {order.order_number}

Thank you for shopping with Neela Jewellery.

We hope to see you again.

Regards,
Neela Jewellery Team
""",
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=False,
    )

def send_cancelled_email(order):
    send_mail(
        "Order Cancelled",
        f"""
Dear {order.shipping_address.full_name},

Your order has been cancelled.

Order Number : {order.order_number}

If payment was made, the refund will be processed shortly.

Regards,
Neela Jewellery Team
""",
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=False,
    )

@transaction.atomic
def create_order_from_cart(user, address_id, coupon_code=None, notes=None):
    """
    The full checkout flow, atomically:
      1. Lock the user's cart items + their products.
      2. Re-validate stock (it may have changed since items were added).
      3. Validate the shipping address belongs to this user.
      4. Apply + validate the coupon, if any.
      5. Calculate subtotal / discount / shipping / tax / total.
      6. Create the Order + OrderItems (snapshotting product data).
      7. Deduct stock from each product.
      8. Increment the coupon's usage counter.
      9. Empty the cart.

    Any failure anywhere rolls the whole thing back — no partial orders,
    no stock deducted without a matching order, no emptied cart without
    a created order.
    """
    try:
        address = Address.objects.get(pk=address_id, user=user)
    except Address.DoesNotExist:
        raise ValidationError({"address_id": "This address does not belong to you."})

    try:
        cart = Cart.objects.select_related("user").get(user=user)
    except Cart.DoesNotExist:
        raise ValidationError({"detail": "Your cart is empty."})

    cart_items = list(
        cart.items.select_for_update().select_related("product").order_by("added_at")
    )
    if not cart_items:
        raise ValidationError({"detail": "Your cart is empty."})

    # Re-validate stock — it may have dropped since the item was added.
    insufficient = []
    for item in cart_items:
        # Lock the product row too, so nothing else can sell it out
        # from under us between this check and the deduction below.
        item.product = Product.objects.select_for_update().get(pk=item.product_id)
        if item.quantity > item.product.stock_quantity:
            insufficient.append(
                f"{item.product.name} (requested {item.quantity}, only {item.product.stock_quantity} left)"
            )
    if insufficient:
        raise ValidationError({"detail": "Some items are no longer available in the requested quantity.",
                                "items": insufficient})

    subtotal = sum((item.product.current_price * item.quantity for item in cart_items), Decimal("0.00"))

    coupon, discount_amount = _apply_coupon(coupon_code, subtotal, user)
    shipping_charge = _calculate_shipping(subtotal - discount_amount)
    taxable_amount = max(subtotal - discount_amount, Decimal("0.00"))
    tax_amount = (taxable_amount * TAX_RATE).quantize(Decimal("0.01"))
    total_amount = taxable_amount + shipping_charge + tax_amount

    order = Order.objects.create(
        user=user,
        shipping_address=address,
        coupon=coupon,
        subtotal=subtotal,
        discount_amount=discount_amount,
        shipping_charge=shipping_charge,
        tax_amount=tax_amount,
        total_amount=total_amount,
        notes=notes or "",
    )

    for item in cart_items:
        product = item.product
        primary_image = product.images.filter(is_primary=True).first() or product.images.first()

        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            product_image_url=primary_image.image.url if primary_image and primary_image.image else None,
            price=product.current_price,
            quantity=item.quantity,
        )

        product.stock_quantity -= item.quantity
        product.save(update_fields=["stock_quantity"])

    if coupon:
        coupon.used_count += 1
        coupon.save(update_fields=["used_count"])

    cart.items.all().delete()

   

    return order

    


@transaction.atomic
def cancel_order(user, order_number):
    """
    Cancel an order and restock every item on it. Only allowed while
    the order is still in a cancellable state (hasn't shipped yet).
    Staff can cancel any order; customers can only cancel their own.
    """
    queryset = Order.objects.select_for_update()
    if not user.is_staff:
        queryset = queryset.filter(user=user)

    try:
        order = queryset.get(order_number=order_number)
    except Order.DoesNotExist:
        raise ValidationError({"detail": "Order not found."})

    if order.status not in CANCELLABLE_STATUSES:
        raise ValidationError(
            {"detail": f"An order that is '{order.get_status_display()}' can no longer be cancelled."}
        )

    for item in order.items.select_related("product").all():
        if item.product is not None:
            item.product.stock_quantity += item.quantity
            item.product.save(update_fields=["stock_quantity"])

    order.status = Order.Status.CANCELLED
    if order.payment_status == Order.PaymentStatus.PAID:
        order.payment_status = Order.PaymentStatus.REFUNDED
    order.updated_at = timezone.now()
    order.save(update_fields=["status", "payment_status", "updated_at"])

    notify_order_status_change(order)

    return order
