from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Address, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = (
        "email",
        "username",
        "first_name",
        "last_name",
        "phone_number",
        "is_email_verified",
        "is_staff",
        "created_at",
    )
    list_filter = ("is_staff", "is_active", "is_email_verified", "created_at")
    search_fields = ("email", "username", "first_name", "last_name", "phone_number")
    ordering = ("-created_at",)
    readonly_fields = ("id", "created_at", "updated_at")

    fieldsets = BaseUserAdmin.fieldsets + (
        (
            "Profile",
            {
                "fields": (
                    "phone_number",
                    "date_of_birth",
                    "profile_image",
                    "is_email_verified",
                    "is_phone_verified",
                )
            },
        ),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "user",
        "city",
        "state",
        "postal_code",
        "address_type",
        "is_default",
    )
    list_filter = ("address_type", "is_default", "state", "country")
    search_fields = ("full_name", "phone_number", "city", "postal_code", "user__email")
    autocomplete_fields = ("user",)
