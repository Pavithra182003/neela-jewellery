from rest_framework import serializers

from products.serializers import ProductListSerializer

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    unavailable_quantity = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ("id", "product", "quantity", "subtotal", "unavailable_quantity", "added_at")

    def get_unavailable_quantity(self, obj):
        """How many units of this line item exceed current stock — lets
        the frontend warn the user before checkout if stock dropped
        after the item was added (e.g. someone else bought the last one)."""
        shortfall = obj.quantity - obj.product.stock_quantity
        return max(shortfall, 0)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    has_unavailable_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ("id", "items", "total_items", "subtotal", "has_unavailable_items", "updated_at")

    def get_has_unavailable_items(self, obj):
        return any(item.quantity > item.product.stock_quantity for item in obj.items.all())


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
