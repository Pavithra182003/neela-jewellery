from django.urls import path

from .views import CartAddItemView, CartClearView, CartItemDetailView, CartView

app_name = "cart"

urlpatterns = [
    path("", CartView.as_view(), name="cart_detail"),
    path("add/", CartAddItemView.as_view(), name="cart_add"),
    path("items/<uuid:item_id>/", CartItemDetailView.as_view(), name="cart_item_detail"),
    path("clear/", CartClearView.as_view(), name="cart_clear"),
]
