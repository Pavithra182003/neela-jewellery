from rest_framework import serializers

from .models import Payment


class CreateRazorpayOrderSerializer(serializers.Serializer):
    order_number = serializers.CharField()


class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()


class PaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source="order.order_number", read_only=True)

    class Meta:
        model = Payment
        fields = (
            "id",
            "order_number",
            "amount",
            "currency",
            "method",
            "status",
            "invoice_url",
            "created_at",
        )
