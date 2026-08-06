from rest_framework import serializers

from categories.serializers import SubcategorySerializer

from .models import Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "is_primary", "display_order")


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight shape used for grid/listing pages (shop, search,
    related products, wishlist, cart) — no full description/gallery."""

    category = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    primary_image = serializers.SerializerMethodField()
    secondary_image = serializers.SerializerMethodField()
    current_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "sku",
            "category",
            "category_slug",
            "material",
            "gender",
            "price",
            "discount_price",
            "current_price",
            "discount_percentage",
            "primary_image",
            "secondary_image",
            "average_rating",
            "review_count",
            "in_stock",
            "stock_quantity",
            "is_featured",
            "is_bestseller",
            "is_new_arrival",
        )

    def get_primary_image(self, obj):
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        if not image:
            return None
        request = self.context.get("request")
        url = image.image.url
        return request.build_absolute_uri(url) if request else url

    def get_secondary_image(self, obj):
        """The second gallery image, if one exists — used to swap the
        product card's photo on hover, a common luxury-storefront touch
        (e.g. a detail shot or the piece being worn)."""
        images = list(obj.images.all().order_by("display_order", "created_at"))
        if len(images) < 2:
            return None
        primary = next((img for img in images if img.is_primary), images[0])
        remaining = [img for img in images if img.id != primary.id]
        if not remaining:
            return None
        request = self.context.get("request")
        url = remaining[0].image.url
        return request.build_absolute_uri(url) if request else url


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full representation for the product details page."""

    category = SubcategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    current_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "sku",
            "category",
            "description",
            "short_description",
            "material",
            "gender",
            "weight_grams",
            "purity",
            "price",
            "discount_price",
            "current_price",
            "discount_percentage",
            "stock_quantity",
            "in_stock",
            "images",
            "average_rating",
            "review_count",
            "is_featured",
            "is_bestseller",
            "is_new_arrival",
            "meta_title",
            "meta_description",
            "created_at",
            "updated_at",
        )


class ProductWriteSerializer(serializers.ModelSerializer):
    """Used by staff to create/update a product. Images are uploaded
    separately via ProductViewSet.upload_image so this stays simple
    and works with both JSON and multipart requests."""

    class Meta:
        model = Product
        fields = (
            "id",
            "category",
            "name",
            "sku",
            "description",
            "short_description",
            "material",
            "gender",
            "weight_grams",
            "purity",
            "price",
            "discount_price",
            "stock_quantity",
            "is_featured",
            "is_bestseller",
            "is_new_arrival",
            "is_active",
            "meta_title",
            "meta_description",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        discount_price = attrs.get(
            "discount_price", getattr(self.instance, "discount_price", None)
        )
        price = attrs.get("price", getattr(self.instance, "price", None))
        if discount_price and price and discount_price >= price:
            raise serializers.ValidationError(
                {"discount_price": "Discount price must be lower than the regular price."}
            )
        return attrs
