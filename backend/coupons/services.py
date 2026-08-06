from decimal import Decimal

from rest_framework.exceptions import ValidationError

from .models import Coupon


def validate_coupon_for_user(code, subtotal, user, lock=False):
    """
    The single source of truth for "is this coupon usable, right now,
    by this user, for this order total?" Used by both:
      - coupons.views.ValidateCouponView (a lightweight preview while
        the customer is still on the cart page, no locking needed)
      - orders.services.create_order_from_cart (the real checkout,
        where lock=True so the row is held for the duration of the
        order-creation transaction — prevents two concurrent checkouts
        both squeezing through a single-use coupon's last use).

    Returns (coupon, discount_amount). Raises ValidationError (DRF) on
    any rule violation, with a message safe to show the customer.
    """
    if not code:
        raise ValidationError({"code": "Coupon code is required."})

    # Imported here (not at module top) purely to keep the import list
    # obviously scoped to "only needed for the lock" — functionally it
    # would work at the top too, since orders.models is already fully
    # loaded by the time any view imports this module.
    queryset = Coupon.objects.select_for_update() if lock else Coupon.objects

    try:
        coupon = queryset.get(code=code.upper().strip())
    except Coupon.DoesNotExist:
        raise ValidationError({"code": "This coupon code does not exist."})

    if not coupon.is_valid_now:
        raise ValidationError({"code": "This coupon has expired or is no longer active."})

    subtotal = Decimal(subtotal)
    if subtotal < coupon.min_purchase_amount:
        raise ValidationError(
            {"code": f"This coupon requires a minimum order of ₹{coupon.min_purchase_amount}."}
        )

    from orders.models import Order  # deferred to sidestep any import-order fragility

    prior_uses = Order.objects.filter(user=user, coupon=coupon).exclude(
        status=Order.Status.CANCELLED
    ).count()
    if prior_uses >= coupon.per_user_limit:
        raise ValidationError({"code": "You've already used this coupon the maximum number of times."})

    discount = coupon.calculate_discount(subtotal)
    return coupon, discount
