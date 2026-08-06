from rest_framework import serializers

from .models import Coupon


class CouponSerializer(serializers.ModelSerializer):
    """Full representation — used by the staff admin panel for
    listing/creating/editing coupons."""

    is_valid_now = serializers.BooleanField(read_only=True)

    class Meta:
        model = Coupon
        fields = (
            "id",
            "code",
            "description",
            "discount_type",
            "discount_value",
            "min_purchase_amount",
            "max_discount_amount",
            "valid_from",
            "valid_until",
            "usage_limit",
            "used_count",
            "per_user_limit",
            "is_active",
            "is_valid_now",
            "created_at",
        )
        read_only_fields = ("id", "used_count", "created_at")

    def validate(self, attrs):
        valid_from = attrs.get("valid_from", getattr(self.instance, "valid_from", None))
        valid_until = attrs.get("valid_until", getattr(self.instance, "valid_until", None))
        if valid_from and valid_until and valid_until <= valid_from:
            raise serializers.ValidationError(
                {"valid_until": "Must be after the valid-from date."}
            )
        return attrs


class ValidateCouponSerializer(serializers.Serializer):
    code = serializers.CharField()
