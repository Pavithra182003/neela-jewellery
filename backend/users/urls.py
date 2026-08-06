from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AddressDetailView,
    AddressListCreateView,
    AdminUserListView,
    AdminUserToggleActiveView,
    ChangePasswordView,
    CustomTokenObtainPairView,
    ForgotPasswordView,
    LogoutView,
    MeView,
    RegisterView,
    ResetPasswordView,
    SetDefaultAddressView,
)

app_name = "users"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot_password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("addresses/", AddressListCreateView.as_view(), name="address_list_create"),
    path("addresses/<uuid:pk>/", AddressDetailView.as_view(), name="address_detail"),
    path("addresses/<uuid:pk>/set-default/", SetDefaultAddressView.as_view(), name="address_set_default"),
    path("admin/users/", AdminUserListView.as_view(), name="admin_user_list"),
    path("admin/users/<uuid:pk>/toggle-active/", AdminUserToggleActiveView.as_view(), name="admin_user_toggle_active"),
]
