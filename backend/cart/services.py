from django.db import transaction
from rest_framework.exceptions import ValidationError

from products.models import Product

from .models import Cart, CartItem


@transaction.atomic
def add_item_to_cart(user, product_id, quantity=1):
    """
    Add `quantity` of a product to the user's cart, or increment the
    existing line if it's already there. Locks the product row and the
    cart item row for the duration of the transaction so two concurrent
    "add to cart" requests can't both succeed and oversell stock.

    Returns the CartItem. Raises ValidationError (DRF) on any business
    rule violation — caller just needs to let it propagate.
    """
    try:
        product = Product.objects.select_for_update().get(pk=product_id, is_active=True)
    except Product.DoesNotExist:
        raise ValidationError({"product": "This product is unavailable."})

    if quantity < 1:
        raise ValidationError({"quantity": "Quantity must be at least 1."})

    if product.stock_quantity <= 0:
        raise ValidationError({"product": "This product is currently out of stock."})

    cart, _ = Cart.objects.get_or_create(user=user)
    item, created = CartItem.objects.select_for_update().get_or_create(
        cart=cart, product=product, defaults={"quantity": 0}
    )

    requested_total = quantity if created else item.quantity + quantity

    if requested_total > product.stock_quantity:
        raise ValidationError(
            {
                "quantity": (
                    f"Only {product.stock_quantity} unit(s) of '{product.name}' "
                    f"available. You already have {item.quantity} in your cart."
                    if not created
                    else f"Only {product.stock_quantity} unit(s) of '{product.name}' available."
                )
            }
        )

    item.quantity = requested_total
    item.save()
    return item


@transaction.atomic
def set_item_quantity(user, item_id, quantity):
    """Set a cart line to an exact quantity (used by the +/- stepper in
    the cart UI). Raises ValidationError if it exceeds stock or the
    item doesn't belong to this user."""

    try:
        item = CartItem.objects.select_for_update().select_related("product", "cart").get(
            pk=item_id, cart__user=user
        )
    except CartItem.DoesNotExist:
        raise ValidationError({"detail": "Cart item not found."})

    if quantity < 1:
        raise ValidationError({"quantity": "Quantity must be at least 1. Use remove instead."})

    if quantity > item.product.stock_quantity:
        raise ValidationError(
            {"quantity": f"Only {item.product.stock_quantity} unit(s) available."}
        )

    item.quantity = quantity
    item.save()
    return item
