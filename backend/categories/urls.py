from django.urls import path

from .views import CategoryViewSet

app_name = "categories"

category_list = CategoryViewSet.as_view({
    "get": "list",
    "post": "create",
})

category_detail = CategoryViewSet.as_view({
    "get": "retrieve",
    "put": "update",
    "patch": "partial_update",
    "delete": "destroy",
})

urlpatterns = [
    path("", category_list, name="category_list"),
    path("<slug:slug>/", category_detail, name="category_detail"),
]
