import json
import logging

import razorpay
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    CreateRazorpayOrderSerializer,
    PaymentSerializer,
    VerifyPaymentSerializer,
)
from .services import create_razorpay_order, handle_webhook_event, verify_and_capture_payment

logger = logging.getLogger(__name__)


class CreateRazorpayOrderView(APIView):
    """
    POST /api/payments/create/ — {order_number}

    Opens a Razorpay order for an already-placed NEELA order and
    returns everything the frontend needs to launch Razorpay Checkout
    (razorpay_order_id, amount, currency, key_id, prefill data).
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateRazorpayOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = create_razorpay_order(
            user=request.user, order_number=serializer.validated_data["order_number"]
        )
        return Response(data, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    """
    POST /api/payments/verify/ — {razorpay_order_id, razorpay_payment_id, razorpay_signature}

    Called by the frontend from Razorpay Checkout's `handler` callback
    after a successful payment. Verifies the signature, captures the
    payment, confirms the order, generates the invoice, and emails the
    customer. Idempotent — safe if the webhook already did this.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payment = verify_and_capture_payment(
            user=request.user,
            razorpay_order_id=serializer.validated_data["razorpay_order_id"],
            razorpay_payment_id=serializer.validated_data["razorpay_payment_id"],
            razorpay_signature=serializer.validated_data["razorpay_signature"],
        )
        return Response(PaymentSerializer(payment).data, status=status.HTTP_200_OK)


class RazorpayWebhookView(APIView):
    """
    POST /api/payments/webhook/

    Server-to-server confirmation from Razorpay — the authoritative
    source of truth for payment status, independent of whether the
    customer's browser stayed open long enough to hit /verify/.
    Configure this URL in the Razorpay Dashboard under
    Settings → Webhooks, subscribed to payment.captured and
    payment.failed, with the same secret as RAZORPAY_WEBHOOK_SECRET.
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        signature = request.headers.get("X-Razorpay-Signature", "")
        raw_body = request.body

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        try:
            client.utility.verify_webhook_signature(
                raw_body.decode("utf-8"), signature, settings.RAZORPAY_WEBHOOK_SECRET
            )
        except razorpay.errors.SignatureVerificationError:
            logger.warning("Rejected Razorpay webhook: bad signature.")
            return Response({"detail": "Invalid signature."}, status=status.HTTP_400_BAD_REQUEST)

        event = json.loads(raw_body.decode("utf-8"))
        handle_webhook_event(event)

        return Response({"status": "ok"}, status=status.HTTP_200_OK)
