from rest_framework import serializers

from .models import Category


class SubcategorySerializer(serializers.ModelSerializer):
    """Lightweight representation used when nesting subcategories
    inside their parent — one level deep, enough for the mega menu."""

    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "image", "product_count", "is_active")

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class CategorySerializer(serializers.ModelSerializer):
    """Full category representation, including one level of nested
    subcategories, used for the public list/mega-menu endpoint."""

    subcategories = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "image",
            "parent",
            "is_active",
            "display_order",
            "subcategories",
            "product_count",
            "created_at",
        )
        read_only_fields = ("id", "slug", "created_at")

    def get_subcategories(self, obj):
        children = obj.subcategories.all()
        request = self.context.get("request")
        if not (request and request.user and request.user.is_staff):
            children = children.filter(is_active=True)
        children = children.order_by("display_order", "name")
        return SubcategorySerializer(children, many=True, context=self.context).data

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()
