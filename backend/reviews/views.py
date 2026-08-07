from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from common.pagination import StandardResultsPagination
from common.permissions import IsOwnerOrAdmin
from notifications.services import notify_review_approved
from products.models import Product
from orders.models import Order
from .models import Review
from .serializers import AdminReviewSerializer, ReviewModerationSerializer, ReviewSerializer, ReviewWriteSerializer
from .services import has_purchased


class ProductReviewListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/reviews/product/<slug>/  — approved reviews for a product
    POST /api/reviews/product/<slug>/  — leave a review (one per user
                                          per product; is_verified_purchase
                                          is computed automatically)
    """

    pagination_class = StandardResultsPagination

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return []

    def get_product(self):
        return get_object_or_404(Product, slug=self.kwargs["product_slug"], is_active=True)

    def get_queryset(self):
        return Review.objects.filter(
            product=self.get_product(), is_approved=True
        ).select_related("user").order_by("-created_at")

    def get_serializer_class(self):
        return ReviewWriteSerializer if self.request.method == "POST" else ReviewSerializer

    def create(self, request, *args, **kwargs):
        product = self.get_product()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            review = Review.objects.create(
                product=product,
                user=request.user,
                is_verified_purchase=has_purchased(request.user, product),
                **serializer.validated_data,
            )
        except IntegrityError:
            raise ValidationError({"detail": "You've already reviewed this product."})

        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET     /api/reviews/<id>/  — view a single review
    PATCH   /api/reviews/<id>/  — edit your own review (rating/title/comment)
    DELETE  /api/reviews/<id>/  — delete your own review (or staff, any review)
    """

    queryset = Review.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_serializer_class(self):
        return ReviewWriteSerializer if self.request.method in ("PUT", "PATCH") else ReviewSerializer


class MyReviewsView(generics.ListAPIView):
    """GET /api/reviews/mine/ — everything the logged-in user has reviewed."""

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsPagination

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user).select_related("product").order_by("-created_at")


class ReviewModerationView(APIView):
    """PATCH /api/reviews/<id>/approve/ — staff only. {"is_approved": true/false}"""

    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        review = get_object_or_404(Review, pk=pk)
        was_approved = review.is_approved
        serializer = ReviewModerationSerializer(review, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        if review.is_approved and not was_approved:
            notify_review_approved(review)
        return Response(ReviewSerializer(review).data)


class AdminReviewListView(generics.ListAPIView):
    """
    GET /api/reviews/admin/ — staff only. Every review across every
    product, for the moderation queue. ?is_approved=false to see only
    what's pending; defaults to showing everything, newest first.
    """

    serializer_class = AdminReviewSerializer
    permission_classes = [IsAdminUser]
    pagination_class = StandardResultsPagination

    def get_queryset(self):
        queryset = Review.objects.select_related("user", "product").order_by("-created_at")
        is_approved = self.request.query_params.get("is_approved")
        if is_approved is not None:
            queryset = queryset.filter(is_approved=is_approved.lower() == "true")
        return queryset

class HomeReviewListView(generics.ListAPIView):
    """
    GET /api/reviews/home/
    Returns the latest approved reviews for the homepage.
    """

    serializer_class = ReviewSerializer

    def get_queryset(self):
        return (
            Review.objects.filter(is_approved=True)
            .select_related("user")
            .order_by("-created_at")[:8]
        )