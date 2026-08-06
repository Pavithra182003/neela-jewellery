from django.urls import path
from . import views

app_name = "reviews"

urlpatterns = [
    path("mine/", views.MyReviewsView.as_view(), name="review_mine"),

    path("admin/", views.AdminReviewListView.as_view(), name="review_admin_list"),

    path("home/", views.HomeReviewListView.as_view(), name="home_reviews"),

    path(
        "product/<slug:product_slug>/",
        views.ProductReviewListCreateView.as_view(),
        name="product_review_list_create",
    ),

    path("<uuid:pk>/", views.ReviewDetailView.as_view(), name="review_detail"),

    path(
        "<uuid:pk>/approve/",
        views.ReviewModerationView.as_view(),
        name="review_approve",
    ),
]