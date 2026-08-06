from django.contrib import admin

from .models import Coupon


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "discount_type",
        "discount_value",
        "valid_from",
        "valid_until",
        "used_count",
        "usage_limit",
        "is_active",
    )
    list_filter = ("discount_type", "is_active")
    search_fields = ("code", "description")
    readonly_fields = ("used_count", "created_at")
