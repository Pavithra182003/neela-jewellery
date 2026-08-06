from django.urls import path

from .views import ProductViewSet

app_name = "products"

product_list = ProductViewSet.as_view({
    "get": "list",
    "post": "create",
})

product_detail = ProductViewSet.as_view({
    "get": "retrieve",
    "put": "update",
    "patch": "partial_update",
    "delete": "destroy",
})

product_upload_image = ProductViewSet.as_view({"post": "upload_image"})
product_delete_image = ProductViewSet.as_view({"delete": "delete_image"})
product_featured = ProductViewSet.as_view({"get": "featured"})
product_bestsellers = ProductViewSet.as_view({"get": "bestsellers"})
product_new_arrivals = ProductViewSet.as_view({"get": "new_arrivals"})
product_related = ProductViewSet.as_view({"get": "related"})
product_low_stock = ProductViewSet.as_view({"get": "low_stock"})

urlpatterns = [
    # Fixed/curated routes must come before the "<slug>/" catch-all,
    # otherwise "featured" etc. would be parsed as a product slug.
    path("featured/", product_featured, name="product_featured"),
    path("bestsellers/", product_bestsellers, name="product_bestsellers"),
    path("new-arrivals/", product_new_arrivals, name="product_new_arrivals"),
    path("low_stock/", product_low_stock, name="product_low_stock"),

    path("", product_list, name="product_list"),

    path("<slug:slug>/", product_detail, name="product_detail"),
    path("<slug:slug>/related/", product_related, name="product_related"),
    path("<slug:slug>/upload_image/", product_upload_image, name="product_upload_image"),
    path(
        "<slug:slug>/images/<uuid:image_id>/",
        product_delete_image,
        name="product_delete_image",
    ),
]
