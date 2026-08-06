from django.urls import path

from .views import CouponDetailView, CouponListCreateView, ValidateCouponView

app_name = "coupons"

urlpatterns = [
    path("validate/", ValidateCouponView.as_view(), name="coupon_validate"),
    path("", CouponListCreateView.as_view(), name="coupon_list_create"),
    path("<uuid:pk>/", CouponDetailView.as_view(), name="coupon_detail"),
]
