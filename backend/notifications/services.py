from .models import Notification

# Maps an Order.status value to (title, message-template). Used by
# notify_order_status_change for every transition except the initial
# "placed" event, which has its own richer message (notify_order_placed).
ORDER_STATUS_MESSAGES = {
    "confirmed": ("Order confirmed", "Your order {order_number} has been confirmed and is being prepared."),
    "processing": ("Order is being processed", "Your order {order_number} is now being processed."),
    "shipped": ("Order shipped", "Your order {order_number} has shipped and is on its way."),
    "delivered": ("Order delivered", "Your order {order_number} has been delivered. We hope you love it!"),
    "cancelled": ("Order cancelled", "Your order {order_number} has been cancelled and any payment refunded."),
    "returned": ("Order returned", "Your order {order_number} has been marked as returned."),
}


def create_notification(user, notification_type, title, message, link=None):
    return Notification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        link=link or "",
    )


def notify_order_placed(order):
    return create_notification(
        user=order.user,
        notification_type=Notification.Type.ORDER_PLACED,
        title="Order placed",
        message=f"We've received your order {order.order_number}. Thank you for shopping with Neela Jewellery!",
        link=f"/account/orders/{order.order_number}",
    )


def notify_order_status_change(order):
    """Call after order.status changes to anything other than the
    initial 'pending' state. Silently no-ops for unmapped statuses."""
    entry = ORDER_STATUS_MESSAGES.get(order.status)
    if not entry:
        return None

    title, message_template = entry
    notification_type = (
        Notification.Type.ORDER_CANCELLED if order.status == "cancelled" else Notification.Type.ORDER_STATUS
    )
    return create_notification(
        user=order.user,
        notification_type=notification_type,
        title=title,
        message=message_template.format(order_number=order.order_number),
        link=f"/account/orders/{order.order_number}",
    )


def notify_payment_success(order):
    return create_notification(
        user=order.user,
        notification_type=Notification.Type.PAYMENT_SUCCESS,
        title="Payment received",
        message=f"We've received your payment of ₹{order.total_amount} for order {order.order_number}.",
        link=f"/account/orders/{order.order_number}",
    )


def notify_payment_failed(order):
    return create_notification(
        user=order.user,
        notification_type=Notification.Type.PAYMENT_FAILED,
        title="Payment failed",
        message=f"Your payment for order {order.order_number} couldn't be processed. Please try again.",
        link=f"/account/orders/{order.order_number}",
    )


def notify_review_approved(review):
    return create_notification(
        user=review.user,
        notification_type=Notification.Type.REVIEW_APPROVED,
        title="Your review is live",
        message=f"Your review for {review.product.name} has been approved and is now visible to other shoppers.",
        link=f"/product/{review.product.slug}",
    )
