from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import NewsletterSubscriber
from .serializers import NewsletterSerializer


class NewsletterSubscribeView(APIView):

    def post(self, request):
        email = request.data.get("email")

        if NewsletterSubscriber.objects.filter(email=email).exists():
            return Response(
                {
                    "message": "You are already subscribed."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = NewsletterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = serializer.save()

        # Customer Email
        send_mail(
            subject="Welcome to Neela Jewellery",
            message=f"""
Dear Customer,

Thank you for subscribing to Neela Jewellery.

You'll receive updates about:

• New Collections
• Exclusive Offers
• Festive Collections
• Latest Jewellery Designs

Thank you for being part of our family.

Neela Jewellery
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[subscriber.email],
            fail_silently=False,
        )

        # Owner Email
        send_mail(
            subject="New Newsletter Subscriber",
            message=f"""
A new customer subscribed.

Email:
{subscriber.email}

Please login to the admin panel to view subscribers.
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.OWNER_EMAIL],
            fail_silently=False,
        )

        return Response(
            {
                "message": "Subscription successful."
            },
            status=status.HTTP_201_CREATED,
        )