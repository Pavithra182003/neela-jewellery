from decimal import Decimal

import resend

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from cart.models import Cart
from coupons.services import validate_coupon_for_user
from notifications.services import notify_order_placed, notify_order_status_change
from products.models import Product
from users.models import Address

from .models import Order, OrderItem


# ------------------------------------------------------------------
# Checkout business rules
# ------------------------------------------------------------------

TAX_RATE = Decimal("0.03")  # 3% GST

CANCELLABLE_STATUSES = {
    Order.Status.PENDING,
    Order.Status.CONFIRMED,
    Order.Status.PROCESSING,
}


# ------------------------------------------------------------------
# SHIPPING CALCULATION
# ------------------------------------------------------------------

def _calculate_shipping(subtotal):
    """
    Shipping charges:

    Below ₹99      -> ₹49
    ₹99 - ₹198     -> ₹39
    ₹199 - ₹298    -> ₹29
    ₹299 - ₹398    -> ₹19
    ₹399 - ₹498    -> ₹9
    ₹499 and above -> FREE
    """

    if subtotal < Decimal("99"):
        return Decimal("49.00")

    elif subtotal < Decimal("199"):
        return Decimal("39.00")

    elif subtotal < Decimal("299"):
        return Decimal("29.00")

    elif subtotal < Decimal("399"):
        return Decimal("19.00")

    elif subtotal < Decimal("499"):
        return Decimal("9.00")

    else:
        return Decimal("0.00")


# ------------------------------------------------------------------
# COUPON
# ------------------------------------------------------------------

def _apply_coupon(coupon_code, subtotal, user):
    """
    Validate and apply coupon.
    """

    if not coupon_code:
        return None, Decimal("0.00")

    return validate_coupon_for_user(
        coupon_code,
        subtotal,
        user,
        lock=True,
    )


# ------------------------------------------------------------------
# RESEND EMAIL HELPER
# ------------------------------------------------------------------

def send_resend_email(subject, message, recipient):
    """
    Send email using Resend HTTPS API.

    This replaces Django SMTP/send_mail().
    It works with Render Free because it uses HTTPS instead
    of SMTP port 587.
    """

    if not recipient:
        print("Email not sent: recipient email is empty.")
        return False

    try:
        resend.api_key = settings.RESEND_API_KEY

        response = resend.Emails.send(
            {
                "from": settings.DEFAULT_FROM_EMAIL,
                "to": [recipient],
                "subject": subject,
                "html": message.replace("\n", "<br>"),
            }
        )

        print(
            f"Email sent successfully to {recipient}. "
            f"Resend response: {response}"
        )

        return True

    except Exception as e:
        # IMPORTANT:
        # Email failure should NEVER make order creation/status
        # update fail with HTTP 500.
        print(
            f"ERROR: Email sending failed to {recipient}: {str(e)}"
        )

        return False


# ------------------------------------------------------------------
# CUSTOMER ORDER PLACED EMAIL
# ------------------------------------------------------------------

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

    send_resend_email(
        subject=subject,
        message=message,
        recipient=order.user.email,
    )


# ------------------------------------------------------------------
# OWNER / ADMIN EMAIL
# ------------------------------------------------------------------

def send_owner_email(order):
    subject = f"New Order Received - {order.order_number}"

    message = f"""
A new customer has placed an order.

Order Number: {order.order_number}

Customer Name: {order.shipping_address.full_name}

Customer Email: {order.user.email}

Phone Number: {order.shipping_address.phone_number}

Payment Method: {order.get_payment_method_display()}

Total Amount: ₹{order.total_amount}

Please login to the Admin Dashboard to process the order.

Neela Jewellery
"""

    send_resend_email(
        subject=subject,
        message=message,
        recipient=settings.OWNER_EMAIL,
    )


# ------------------------------------------------------------------
# PAYMENT RECEIVED EMAIL
# ------------------------------------------------------------------

def send_payment_received_email(order):
    subject = "Payment Received - Neela Jewellery"

    message = f"""
Dear {order.shipping_address.full_name},

We have successfully received your payment.

━━━━━━━━━━━━━━━━━━━━━━

Order Number: {order.order_number}

Amount Paid: ₹{order.total_amount}

Payment Status: Paid

━━━━━━━━━━━━━━━━━━━━━━

Your payment has been verified successfully.

Thank you for shopping with Neela Jewellery.

Regards,
Neela Jewellery Team
"""

    send_resend_email(
        subject=subject,
        message=message,
        recipient=order.user.email,
    )


# ------------------------------------------------------------------
# ORDER CONFIRMED EMAIL
# ------------------------------------------------------------------

def send_confirmed_email(order):
    subject = "Your Order Has Been Confirmed"

    message = f"""
Dear {order.shipping_address.full_name},

Your order has been confirmed.

Order Number: {order.order_number}

Status: Confirmed

We have started preparing your order.

Regards,
Neela Jewellery Team
"""

    send_resend_email(
        subject=subject,
        message=message,
        recipient=order.user.email,
    )


# ------------------------------------------------------------------
# PROCESSING EMAIL
# ------------------------------------------------------------------

def send_processing_email(order):
    subject = "Your Order is Being Prepared"

    message = f"""
Dear {order.shipping_address.full_name},

Your order is currently under processing.

Order Number: {order.order_number}

Our team is carefully preparing your jewellery order.

Regards,
Neela Jewellery Team
"""

    send_resend_email(
        subject=subject,
        message=message,
        recipient=order.user.email,
    )


# ------------------------------------------------------------------
# SHIPPED EMAIL
# ------------------------------------------------------------------

def send_shipped_email(order):
    subject = "Your Order Has Been Shipped"

    tracking_number = order.tracking_number or "Not available"

    message = f"""
Dear {order.shipping_address.full_name},

Great News!

Your order has been shipped.

Order Number: {order.order_number}

Tracking Number: {tracking_number}

Your jewellery is now on its way to you.

Regards,
Neela Jewellery Team
"""

    send_resend_email(
        subject=subject,
        message=message,
        recipient=order.user.email,
    )


# ------------------------------------------------------------------
# DELIVERED EMAIL
# ------------------------------------------------------------------

def send_delivered_email(order):
    subject = "Your Order Has Been Delivered"

    message = f"""
Dear {order.shipping_address.full_name},

Your order has been delivered successfully.

Order Number: {order.order_number}

Thank you for shopping with Neela Jewellery.

We hope to see you again.

Regards,
Neela Jewellery Team
"""

    send_resend_email(
        subject=subject,
        message=message,
        recipient=order.user.email,
    )


# ------------------------------------------------------------------
# CANCELLED EMAIL
# ------------------------------------------------------------------

def send_cancelled_email(order):
    subject = "Order Cancelled"

    message = f"""
Dear {order.shipping_address.full_name},

Your order has been cancelled.

Order Number: {order.order_number}

If payment was made, the refund will be processed shortly.

Regards,
Neela Jewellery Team
"""

    send_resend_email(
        subject=subject,
        message=message,
        recipient=order.user.email,
    )


# ------------------------------------------------------------------
# CREATE ORDER FROM CART
# ------------------------------------------------------------------

@transaction.atomic
def create_order_from_cart(
    user,
    address_id,
    coupon_code=None,
    notes=None,
):
    """
    Complete checkout flow:

    1. Lock cart items and products.
    2. Re-check stock.
    3. Validate shipping address.
    4. Apply coupon.
    5. Calculate subtotal, discount, shipping, GST and total.
    6. Create Order and OrderItems.
    7. Deduct stock.
    8. Update coupon usage.
    9. Empty cart.
    """

    # --------------------------------------------------------------
    # ADDRESS
    # --------------------------------------------------------------

    try:
        address = Address.objects.get(
            pk=address_id,
            user=user,
        )
    except Address.DoesNotExist:
        raise ValidationError(
            {
                "address_id":
                    "This address does not belong to you."
            }
        )

    # --------------------------------------------------------------
    # CART
    # --------------------------------------------------------------

    try:
        cart = Cart.objects.select_related(
            "user"
        ).get(user=user)

    except Cart.DoesNotExist:
        raise ValidationError(
            {
                "detail":
                    "Your cart is empty."
            }
        )

    cart_items = list(
        cart.items
        .select_for_update()
        .select_related("product")
        .order_by("added_at")
    )

    if not cart_items:
        raise ValidationError(
            {
                "detail":
                    "Your cart is empty."
            }
        )

    # --------------------------------------------------------------
    # STOCK VALIDATION
    # --------------------------------------------------------------

    insufficient = []

    for item in cart_items:

        item.product = Product.objects.select_for_update().get(
            pk=item.product_id
        )

        if item.quantity > item.product.stock_quantity:
            insufficient.append(
                f"{item.product.name} "
                f"(requested {item.quantity}, "
                f"only {item.product.stock_quantity} left)"
            )

    if insufficient:
        raise ValidationError(
            {
                "detail":
                    "Some items are no longer available "
                    "in the requested quantity.",

                "items":
                    insufficient,
            }
        )

    # --------------------------------------------------------------
    # SUBTOTAL
    # --------------------------------------------------------------

    subtotal = sum(
        (
            item.product.current_price * item.quantity
            for item in cart_items
        ),
        Decimal("0.00"),
    )

    # --------------------------------------------------------------
    # COUPON
    # --------------------------------------------------------------

    coupon, discount_amount = _apply_coupon(
        coupon_code,
        subtotal,
        user,
    )

    # --------------------------------------------------------------
    # SHIPPING
    # --------------------------------------------------------------

    taxable_amount = max(
        subtotal - discount_amount,
        Decimal("0.00"),
    )

    shipping_charge = _calculate_shipping(
        taxable_amount
    )

    # --------------------------------------------------------------
    # GST
    # --------------------------------------------------------------

    tax_amount = (
        taxable_amount * TAX_RATE
    ).quantize(
        Decimal("0.01")
    )

    # --------------------------------------------------------------
    # FINAL TOTAL
    # --------------------------------------------------------------

    total_amount = (
        taxable_amount
        + shipping_charge
        + tax_amount
    )

    # --------------------------------------------------------------
    # CREATE ORDER
    # --------------------------------------------------------------

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

    # --------------------------------------------------------------
    # CREATE ORDER ITEMS
    # --------------------------------------------------------------

    for item in cart_items:

        product = item.product

        primary_image = (
            product.images
            .filter(is_primary=True)
            .first()
            or product.images.first()
        )

        OrderItem.objects.create(
            order=order,
            product=product,

            product_name=product.name,

            product_image_url=(
                primary_image.image.url
                if primary_image
                and primary_image.image
                else None
            ),

            price=product.current_price,

            quantity=item.quantity,
        )

        # ----------------------------------------------------------
        # DEDUCT STOCK
        # ----------------------------------------------------------

        product.stock_quantity -= item.quantity

        product.save(
            update_fields=["stock_quantity"]
        )

    # --------------------------------------------------------------
    # COUPON USAGE
    # --------------------------------------------------------------

    if coupon:

        coupon.used_count += 1

        coupon.save(
            update_fields=["used_count"]
        )

    # --------------------------------------------------------------
    # EMPTY CART
    # --------------------------------------------------------------

    cart.items.all().delete()

    return order


# ------------------------------------------------------------------
# CANCEL ORDER
# ------------------------------------------------------------------

@transaction.atomic
def cancel_order(
    user,
    order_number,
):
    """
    Cancel an order and restock its items.

    Customers can cancel only their own orders.
    Staff can cancel any order.
    """

    queryset = Order.objects.select_for_update()

    if not user.is_staff:
        queryset = queryset.filter(
            user=user
        )

    try:
        order = queryset.get(
            order_number=order_number
        )

    except Order.DoesNotExist:
        raise ValidationError(
            {
                "detail":
                    "Order not found."
            }
        )

    # --------------------------------------------------------------
    # CHECK STATUS
    # --------------------------------------------------------------

    if order.status not in CANCELLABLE_STATUSES:

        raise ValidationError(
            {
                "detail":
                    f"An order that is "
                    f"'{order.get_status_display()}' "
                    f"can no longer be cancelled."
            }
        )

    # --------------------------------------------------------------
    # RESTOCK
    # --------------------------------------------------------------

    for item in order.items.select_related(
        "product"
    ).all():

        if item.product is not None:

            item.product.stock_quantity += item.quantity

            item.product.save(
                update_fields=["stock_quantity"]
            )

    # --------------------------------------------------------------
    # UPDATE ORDER
    # --------------------------------------------------------------

    order.status = Order.Status.CANCELLED

    if (
        order.payment_status
        == Order.PaymentStatus.PAID
    ):
        order.payment_status = (
            Order.PaymentStatus.REFUNDED
        )

    order.updated_at = timezone.now()

    order.save(
        update_fields=[
            "status",
            "payment_status",
            "updated_at",
        ]
    )

    # --------------------------------------------------------------
    # NOTIFICATION
    # --------------------------------------------------------------

    notify_order_status_change(order)

    return order