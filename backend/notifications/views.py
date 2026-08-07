from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics
from .serializers import NewsletterSubscriberSerializer


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

class NewsletterSubscriberListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = NewsletterSubscriber.objects.all().order_by("-subscribed_at")
    serializer_class = NewsletterSubscriberSerializer

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

        # Already subscribed
        if NewsletterSubscriber.objects.filter(
            email__iexact=email,
            is_active=True
        ).exists():
            return Response(
                {
                    "detail": "You are already subscribed to our newsletter."
                },
                status=status.HTTP_200_OK,
            )

        subscriber = NewsletterSubscriber.objects.filter(
            email__iexact=email
        ).first()

        if subscriber:
            subscriber.is_active = True
            subscriber.save(update_fields=["is_active"])
        else:
            subscriber = NewsletterSubscriber.objects.create(email=email)

        # Welcome email to customer
        send_mail(
            subject="Welcome to Neela Jewellery ✨",
            message=f"""
    Dear Customer,

    Thank you for subscribing to Neela Jewellery!

    We're delighted to have you as part of our family.

    As a subscriber, you'll receive:

    • New Jewellery Collections
    • Exclusive Offers
    • Festive Collections
    • Latest Designs
    • Special Discounts

    Thank you for choosing Neela Jewellery.

    Warm Regards,

    Neela Jewellery
    """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        # Email to owner
        send_mail(
            subject="New Newsletter Subscriber",
            message=f"""
    Hello,

    A new customer has subscribed to the Neela Jewellery newsletter.

    Subscriber Email:
    {email}

    Please login to your admin panel to view all subscribers.

    Regards,
    Neela Jewellery Website
    """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.OWNER_EMAIL],
            fail_silently=False,
        )

        return Response(
            {
                "detail": "Thank you for subscribing to Neela Jewellery!"
            },
            status=status.HTTP_201_CREATED,
        )