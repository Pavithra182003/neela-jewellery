def has_purchased(user, product):
    """
    A review earns the "Verified Purchase" badge if the user has a paid
    order containing this product. Deliberately keyed off payment_status
    (not shipment status) — the customer has genuinely bought it even
    if it hasn't arrived yet, and requiring "delivered" would exclude
    legitimate early reviewers for weeks after a real purchase.
    """
    from orders.models import Order  # deferred: orders app depends on nothing here

    return Order.objects.filter(
        user=user,
        items__product=product,
        payment_status=Order.PaymentStatus.PAID,
    ).exists()
