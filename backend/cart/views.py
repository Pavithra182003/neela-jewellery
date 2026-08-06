from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import AddToCartSerializer, CartSerializer, UpdateCartItemSerializer
from .services import add_item_to_cart, set_item_quantity


class CartView(APIView):
    """GET /api/cart/ — the logged-in user's cart (auto-created empty
    on first access)."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart, context={"request": request}).data)


class CartAddItemView(APIView):
    """POST /api/cart/add/ — {product_id, quantity}. Adds a new line or
    increments an existing one, enforcing stock limits atomically."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item = add_item_to_cart(
            user=request.user,
            product_id=serializer.validated_data["product_id"],
            quantity=serializer.validated_data["quantity"],
        )
        cart = item.cart
        return Response(
            CartSerializer(cart, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class CartItemDetailView(APIView):
    """
    PATCH  /api/cart/items/<id>/  — {quantity} set an exact quantity
    DELETE /api/cart/items/<id>/  — remove this line entirely
    """

    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        set_item_quantity(request.user, item_id, serializer.validated_data["quantity"])
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart, context={"request": request}).data)

    def delete(self, request, item_id):
        deleted, _ = CartItem.objects.filter(pk=item_id, cart__user=request.user).delete()
        if not deleted:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart, context={"request": request}).data)


class CartClearView(APIView):
    """DELETE /api/cart/clear/ — empty the whole cart (used after an
    order is successfully placed, or via a 'clear cart' button)."""

    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response(CartSerializer(cart, context={"request": request}).data)
