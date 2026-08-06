from django.urls import path

from .views import (
    AdminOrderSummaryView,
    OrderCancelView,
    OrderDetailView,
    OrderListCreateView,
    OrderStatusUpdateView,
)

app_name = "orders"

urlpatterns = [
    path("admin/summary/", AdminOrderSummaryView.as_view(), name="admin_order_summary"),
    path("", OrderListCreateView.as_view(), name="order_list_create"),
    path("<str:order_number>/", OrderDetailView.as_view(), name="order_detail"),
    path("<str:order_number>/cancel/", OrderCancelView.as_view(), name="order_cancel"),
    path("<str:order_number>/status/", OrderStatusUpdateView.as_view(), name="order_status_update"),
]
