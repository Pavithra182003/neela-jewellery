from django.urls import path

from .views import MoveToCartView, WishlistItemDeleteView, WishlistToggleView, WishlistView

app_name = "wishlist"

urlpatterns = [
    path("", WishlistView.as_view(), name="wishlist_detail"),
    path("toggle/", WishlistToggleView.as_view(), name="wishlist_toggle"),
    path("items/<uuid:item_id>/", WishlistItemDeleteView.as_view(), name="wishlist_item_delete"),
    path(
        "items/<uuid:item_id>/move-to-cart/",
        MoveToCartView.as_view(),
        name="wishlist_move_to_cart",
    ),
]
