from django.urls import path

from .views import CreateRazorpayOrderView, RazorpayWebhookView, VerifyPaymentView

app_name = "payments"

urlpatterns = [
    path("create/", CreateRazorpayOrderView.as_view(), name="payment_create"),
    path("verify/", VerifyPaymentView.as_view(), name="payment_verify"),
    path("webhook/", RazorpayWebhookView.as_view(), name="payment_webhook"),
]
