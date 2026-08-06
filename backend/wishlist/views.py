from django.db import transaction
from django.shortcuts import get_object_or_404
from products.models import Product
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.services import add_item_to_cart

from .models import Wishlist, WishlistItem
from .serializers import ToggleWishlistSerializer, WishlistSerializer


class WishlistView(APIView):
    """GET /api/wishlist/ — the logged-in user's wishlist (auto-created
    empty on first access)."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        return Response(WishlistSerializer(wishlist, context={"request": request}).data)


class WishlistToggleView(APIView):
    """
    POST /api/wishlist/toggle/ — {product_id}

    If the product is already wishlisted, remove it; otherwise add it.
    This single endpoint powers the heart/wishlist icon everywhere in
    the UI (PDP, shop grid, cart) without the frontend needing to know
    the current state first.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ToggleWishlistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = get_object_or_404(
            Product, pk=serializer.validated_data["product_id"], is_active=True
        )

        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        item = WishlistItem.objects.filter(wishlist=wishlist, product=product).first()

        if item:
            item.delete()
            added = False
        else:
            WishlistItem.objects.create(wishlist=wishlist, product=product)
            added = True

        return Response(
            {
                "added": added,
                "wishlist": WishlistSerializer(wishlist, context={"request": request}).data,
            },
            status=status.HTTP_200_OK,
        )


class WishlistItemDeleteView(APIView):
    """DELETE /api/wishlist/items/<id>/ — remove a single saved item."""

    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        deleted, _ = WishlistItem.objects.filter(
            pk=item_id, wishlist__user=request.user
        ).delete()
        if not deleted:
            return Response({"detail": "Wishlist item not found."}, status=status.HTTP_404_NOT_FOUND)
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        return Response(WishlistSerializer(wishlist, context={"request": request}).data)


class MoveToCartView(APIView):
    """
    POST /api/wishlist/items/<id>/move-to-cart/

    Business logic: atomically add the wishlisted product to the cart
    (respecting the same stock-limit rules as a normal add-to-cart) and,
    only if that succeeds, remove it from the wishlist. If stock is
    insufficient, the item stays on the wishlist and a 400 is returned.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, item_id):
        wishlist_item = get_object_or_404(
            WishlistItem, pk=item_id, wishlist__user=request.user
        )

        with transaction.atomic():
            add_item_to_cart(
                user=request.user, product_id=wishlist_item.product_id, quantity=1
            )
            wishlist_item.delete()

        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        return Response(
            WishlistSerializer(wishlist, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )
