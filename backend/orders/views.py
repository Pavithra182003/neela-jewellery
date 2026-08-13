from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from common.pagination import StandardResultsPagination
from notifications.services import notify_order_status_change

from .models import Order
from .serializers import (
    CreateOrderSerializer,
    OrderDetailSerializer,
    OrderSerializer,
    OrderStatusUpdateSerializer,
)
from .services import (
    cancel_order,
    create_order_from_cart,
    send_payment_received_email,
    send_confirmed_email,
    send_processing_email,
    send_shipped_email,
    send_delivered_email,
    send_cancelled_email,
)


class OrderListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/orders/   — the logged-in user's own order history
                           (staff instead see ALL orders; add ?status=
                           to filter, e.g. ?status=shipped)
    POST /api/orders/   — place a new order from the current cart
                           {address_id, coupon_code?, notes?}
    """

    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ["placed_at", "total_amount"]
    ordering = ["-placed_at"]

    def get_queryset(self):
        queryset = Order.objects.select_related("shipping_address", "coupon").prefetch_related("items")

        if self.request.user.is_staff:
            status_param = self.request.query_params.get("status")
            if status_param:
                queryset = queryset.filter(status=status_param)
            return queryset

        return queryset.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateOrderSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order = create_order_from_cart(
            user=request.user,
            address_id=serializer.validated_data["address_id"],
            coupon_code=serializer.validated_data.get("coupon_code"),
            notes=serializer.validated_data.get("notes"),
        )
        # Save the selected payment method
        order.payment_method = serializer.validated_data.get("payment_method",
            Order.PaymentMethod.COD,
       )
        order.save()
        return Response(
            OrderDetailSerializer(order, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED,
        )


class OrderDetailView(generics.RetrieveAPIView):
    """GET /api/orders/<order_number>/ — full order detail. Owners can
    view their own orders; staff can view any order."""

    serializer_class = OrderDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "order_number"

    def get_queryset(self):
        queryset = Order.objects.select_related("shipping_address", "coupon").prefetch_related("items")
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(user=self.request.user)


class OrderCancelView(APIView):
    """POST /api/orders/<order_number>/cancel/ — cancel an order and
    restock its items. Blocked once an order has shipped."""

    permission_classes = [IsAuthenticated]

    def post(self, request, order_number):
        order = cancel_order(user=request.user, order_number=order_number)
        return Response(OrderDetailSerializer(order, context={"request": request}).data)


class OrderStatusUpdateView(APIView):
    """
    PATCH /api/orders/<order_number>/status/
    """

    permission_classes = [IsAdminUser]

    def patch(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number)

        print("REQUEST DATA:", request.data)

        # Store the old values BEFORE updating
        old_status = order.status
        old_payment_status = order.payment_status

        serializer = OrderStatusUpdateSerializer(
            order,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        print("VALIDATED DATA:", serializer.validated_data)

        serializer.save()

        print("OLD STATUS:", old_status)
        print("NEW STATUS:", order.status)
        print("OLD PAYMENT STATUS:", old_payment_status)
        print("NEW PAYMENT STATUS:", order.payment_status)

        # ------------------------------------------------------------
        # PAYMENT RECEIVED
        # ------------------------------------------------------------
        # Send payment email only when payment changes to PAID.
        if (
            old_payment_status != Order.PaymentStatus.PAID
            and order.payment_status == Order.PaymentStatus.PAID
        ):
            send_payment_received_email(order)

        # ------------------------------------------------------------
        # CONFIRMED
        # ------------------------------------------------------------
        # Send confirmation email whenever the order changes to CONFIRMED.
        if (
            old_status != Order.Status.CONFIRMED
            and order.status == Order.Status.CONFIRMED
        ):
            send_confirmed_email(order)

        # ------------------------------------------------------------
        # PROCESSING
        # ------------------------------------------------------------
        elif (
            old_status != Order.Status.PROCESSING
            and order.status == Order.Status.PROCESSING
        ):
            send_processing_email(order)

        # ------------------------------------------------------------
        # SHIPPED
        # ------------------------------------------------------------
        elif (
            old_status != Order.Status.SHIPPED
            and order.status == Order.Status.SHIPPED
        ):
            send_shipped_email(order)

        # ------------------------------------------------------------
        # DELIVERED
        # ------------------------------------------------------------
        elif (
            old_status != Order.Status.DELIVERED
            and order.status == Order.Status.DELIVERED
        ):
            send_delivered_email(order)

        # ------------------------------------------------------------
        # CANCELLED
        # ------------------------------------------------------------
        elif (
            old_status != Order.Status.CANCELLED
            and order.status == Order.Status.CANCELLED
        ):
            send_cancelled_email(order)

        # ------------------------------------------------------------
        # NOTIFICATION
        # ------------------------------------------------------------
        notify_order_status_change(order)

        return Response(
            OrderDetailSerializer(
                order,
                context={"request": request}
            ).data
        )
class AdminOrderSummaryView(APIView):
    """
    GET /api/orders/admin/summary/ — staff only.

    Powers the admin dashboard's headline metrics. Deliberately a
    single aggregate-query endpoint rather than making the frontend
    paginate through every order client-side to compute totals — that
    would be both slower and silently wrong once order volume grows
    past a single page.
    """

    permission_classes = [IsAdminUser]

    def get(self, request):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        last_30_days = timezone.now() - timedelta(days=30)

        paid_orders = Order.objects.filter(payment_status=Order.PaymentStatus.PAID)

        totals = paid_orders.aggregate(total_revenue=Sum("total_amount"), paid_order_count=Count("id"))
        today_totals = paid_orders.filter(placed_at__gte=today_start).aggregate(
            revenue_today=Sum("total_amount"), orders_today=Count("id")
        )

        status_counts = dict(
            Order.objects.values_list("status").annotate(count=Count("id")).order_by()
        )

        recent_orders = Order.objects.select_related("shipping_address").order_by("-placed_at")[:8]

        revenue_by_day = (
            paid_orders.filter(placed_at__gte=last_30_days)
            .annotate(day=TruncDate("placed_at"))
            .values("day")
            .annotate(revenue=Sum("total_amount"))
            .order_by("day")
        )

        return Response(
            {
                "total_revenue": totals["total_revenue"] or 0,
                "paid_order_count": totals["paid_order_count"] or 0,
                "revenue_today": today_totals["revenue_today"] or 0,
                "orders_today": today_totals["orders_today"] or 0,
                "orders_by_status": status_counts,
                "revenue_last_30_days": list(revenue_by_day),
                "recent_orders": OrderSerializer(recent_orders, many=True).data,
            }
        )
