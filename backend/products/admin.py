from django.contrib import admin

from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "alt_text", "is_primary", "display_order")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "sku",
        "category",
        "material",
        "price",
        "discount_price",
        "stock_quantity",
        "is_active",
        "is_featured",
    )
    list_filter = (
        "category",
        "material",
        "gender",
        "is_active",
        "is_featured",
        "is_bestseller",
        "is_new_arrival",
    )
    search_fields = ("name", "sku", "description")
    prepopulated_fields = {"slug": ("name",)}
    autocomplete_fields = ("category",)
    inlines = [ProductImageInline]
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 25


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "is_primary", "display_order", "created_at")
    list_filter = ("is_primary",)
    autocomplete_fields = ("product",)
