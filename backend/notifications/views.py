from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from common.pagination import StandardResultsPagination

from .models import Notification, NewsletterSubscriber
from .serializers import NewsletterSubscribeSerializer, NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """GET /api/notifications/ — the logged-in user's notifications,
    newest first. Add ?is_read=false to fetch only unread ones."""

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsPagination

    def get_queryset(self):
        queryset = Notification.objects.filter(user=self.request.user)
        is_read = self.request.query_params.get("is_read")
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == "true")
        return queryset


class UnreadCountView(APIView):
    """GET /api/notifications/unread-count/ — powers the navbar bell badge."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({"unread_count": count})


class MarkNotificationReadView(APIView):
    """PATCH /api/notifications/<id>/read/ — mark one notification read."""

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, user=request.user)
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response(NotificationSerializer(notification).data)


class MarkAllNotificationsReadView(APIView):
    """POST /api/notifications/mark-all-read/ — clear the whole bell badge at once."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        updated = Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"marked_read": updated}, status=status.HTTP_200_OK)


class NewsletterSubscribeView(APIView):
    """
    POST /api/notifications/newsletter/subscribe/ — {email}

    Public, no auth required — most subscribers are anonymous visitors.
    Idempotent: subscribing twice with the same email just reactivates
    it if it was previously unsubscribed, never errors or duplicates.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = NewsletterSubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        subscriber = NewsletterSubscriber.objects.filter(email__iexact=email).first()
        created = subscriber is None
        if created:
            subscriber = NewsletterSubscriber.objects.create(email=email)
        elif not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save(update_fields=["is_active"])

        return Response(
            {"detail": "You're subscribed! Watch your inbox for new arrivals and exclusive offers."},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
