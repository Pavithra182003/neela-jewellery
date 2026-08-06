from rest_framework import serializers
from .models import InstagramGallery


class InstagramGallerySerializer(serializers.ModelSerializer):

    class Meta:
        model = InstagramGallery
        fields = [
            "id",
            "image",
            "instagram_url",
            "display_order",
            "is_active",
        ]