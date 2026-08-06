from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    autocomplete_fields = ("product",)
    readonly_fields = ("subtotal",)

    def subtotal(self, obj):
        return obj.subtotal

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_number",
        "user",
        "payment_method",
        "status",
        "payment_status",
        "total_amount",
        "placed_at",
    )

    list_filter = (
        "payment_method",
        "status",
        "payment_status",
        "placed_at",
    )

    search_fields = (
        "order_number",
        "user__email",
        "tracking_number",
    )

    autocomplete_fields = (
        "user",
        "shipping_address",
        "coupon",
    )

    readonly_fields = (
        "order_number",
        "placed_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Order Information",
            {
                "fields": (
                    "order_number",
                    "user",
                    "shipping_address",
                    "coupon",
                )
            },
        ),
        (
            "Payment",
            {
                "fields": (
                    "payment_method",
                    "payment_status",
                    "payment_screenshot",
                    "upi_transaction_id",
                )
            },
        ),
        (
            "Order Status",
            {
                "fields": (
                    "status",
                    "tracking_number",
                    "notes",
                )
            },
        ),
        (
            "Amount",
            {
                "fields": (
                    "subtotal",
                    "discount_amount",
                    "shipping_charge",
                    "tax_amount",
                    "total_amount",
                )
            },
        ),
        (
            "Dates",
            {
                "fields": (
                    "placed_at",
                    "updated_at",
                )
            },
        ),
    )

    inlines = [OrderItemInline]

    list_per_page = 25

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "product_name", "price", "quantity")
    search_fields = ("order__order_number", "product_name")
    autocomplete_fields = ("order", "product")
