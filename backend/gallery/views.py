from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import InstagramGallery
from .serializers import InstagramGallerySerializer


class InstagramGalleryViewSet(viewsets.ModelViewSet):
    serializer_class = InstagramGallerySerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return InstagramGallery.objects.all().order_by("display_order")

        return InstagramGallery.objects.filter(
            is_active=True
        ).order_by("display_order")

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [IsAdminUser()]