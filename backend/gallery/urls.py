from django.urls import path
from .views import InstagramGalleryViewSet

gallery_list = InstagramGalleryViewSet.as_view({
    "get": "list",
    "post": "create",
})

gallery_detail = InstagramGalleryViewSet.as_view({
    "put": "update",
    "patch": "partial_update",
    "delete": "destroy",
})

urlpatterns = [
    path("", gallery_list, name="gallery-list"),
    path("<int:pk>/", gallery_detail, name="gallery-detail"),
]