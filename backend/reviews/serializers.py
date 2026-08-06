from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    """Public read shape — shown on the product details page."""

    user_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = Review
        fields = (
            "id",
            "user_name",
            "rating",
            "title",
            "comment",
            "is_verified_purchase",
            "created_at",
        )


class ReviewWriteSerializer(serializers.ModelSerializer):
    """Used to create a new review. product/user/is_verified_purchase
    are set server-side in the view, never trusted from the client."""

    class Meta:
        model = Review
        fields = ("id", "rating", "title", "comment")
        read_only_fields = ("id",)


class ReviewModerationSerializer(serializers.ModelSerializer):
    """Staff-only: approve/hide a review."""

    class Meta:
        model = Review
        fields = ("is_approved",)


class AdminReviewSerializer(serializers.ModelSerializer):
    """Includes product context, used only in the staff moderation
    queue where reviews from many different products are mixed together."""

    user_name = serializers.CharField(source="user.full_name", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_slug = serializers.CharField(source="product.slug", read_only=True)

    class Meta:
        model = Review
        fields = (
            "id",
            "user_name",
            "product_name",
            "product_slug",
            "rating",
            "title",
            "comment",
            "is_verified_purchase",
            "is_approved",
            "created_at",
        )
