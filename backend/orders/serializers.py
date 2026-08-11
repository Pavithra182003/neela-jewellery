from rest_framework import serializers

from users.models import Address

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    product_slug = serializers.CharField(
        source="product.slug",
        read_only=True,
    )

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product",
            "product_slug",     
            "product_name",
            "product_image_url",
            "price",
            "quantity",
            "subtotal",
        )

class OrderAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            "full_name",
            "phone_number",
            "address_line1",
            "address_line2",
            "landmark",
            "city",
            "state",
            "postal_code",
            "country",
        )


class OrderSerializer(serializers.ModelSerializer):
    
    total_items = serializers.IntegerField(read_only=True)
    product_name = serializers.SerializerMethodField()
    customer_name = serializers.CharField(source="shipping_address.full_name", read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            
            "order_number",
            "customer_name",
            "product_name",
            "status",
            "payment_status",
            "payment_method",
            "total_items",
            "total_amount",
            "placed_at",
        )

    def get_product_name(self, obj):
        item = obj.items.first()
        if item:
            return item.product_name
        return "-"
class OrderDetailSerializer(serializers.ModelSerializer):
    """Full order representation for the order-details / confirmation page."""
   
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = OrderAddressSerializer(read_only=True)
    coupon_code = serializers.CharField(source="coupon.code", read_only=True, default=None)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
           
            "order_number",
            "status",
            "payment_status",
            "payment_method",
            "items",
            "total_items",
            "shipping_address",
            "coupon_code",
            "subtotal",
            "discount_amount",
            "shipping_charge",
            "tax_amount",
            "total_amount",
            "tracking_number",
            "notes",
            "placed_at",
            "updated_at",
        )


class CreateOrderSerializer(serializers.Serializer):
    address_id = serializers.UUIDField()

    payment_method = serializers.ChoiceField(
        choices=Order.PaymentMethod.choices,
        default=Order.PaymentMethod.COD,
    )

    coupon_code = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    notes = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    def validate_address_id(self, value):
        request = self.context["request"]
        if not Address.objects.filter(pk=value, user=request.user).exists():
            raise serializers.ValidationError("This address does not belong to you.")
        return value


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "status",
            "payment_status",
            "tracking_number",
        )

    def validate_status(self, value):
        if (
            self.instance
            and self.instance.status == Order.Status.CANCELLED
        ):
            raise serializers.ValidationError(
                "A cancelled order's status cannot be changed."
            )

        return value
