from django.contrib import admin
from .models import InstagramGallery


@admin.register(InstagramGallery)
class InstagramGalleryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "display_order",
        "is_active",
    )

    list_editable = (
        "display_order",
        "is_active",
    )