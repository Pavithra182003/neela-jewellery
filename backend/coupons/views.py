from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart

from .models import Coupon
from .serializers import CouponSerializer, ValidateCouponSerializer
from .services import validate_coupon_for_user


class CouponListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/coupons/ — staff only. Manage the full coupon list."""

    queryset = Coupon.objects.all().order_by("-created_at")
    serializer_class = CouponSerializer
    permission_classes = [IsAdminUser]


class CouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/PATCH/DELETE /api/coupons/<id>/ — staff only."""

    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [IsAdminUser]


class ValidateCouponView(APIView):
    """
    POST /api/coupons/validate/ — {code}

    A lightweight preview used on the cart/checkout page: tells the
    customer whether a coupon works and what it would save, against
    their CURRENT cart subtotal, without creating an order or locking
    anything. The real, authoritative check happens again at checkout
    (Module 6) using the same underlying logic with row locking.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ValidateCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = Cart.objects.filter(user=request.user).first()
        subtotal = cart.subtotal if cart else 0

        if not subtotal:
            return Response(
                {"detail": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST
            )

        coupon, discount = validate_coupon_for_user(
            code=serializer.validated_data["code"], subtotal=subtotal, user=request.user
        )

        return Response(
            {
                "valid": True,
                "code": coupon.code,
                "discount_amount": discount,
                "cart_subtotal": subtotal,
                "estimated_total": subtotal - discount,
            },
            status=status.HTTP_200_OK,
        )
