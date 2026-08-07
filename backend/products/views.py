from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from common.pagination import StandardResultsPagination
from common.permissions import IsAdminOrReadOnly

from .filters import ProductFilter
from .models import Product, ProductImage
from .serializers import (
    ProductDetailSerializer,
    ProductImageSerializer,
    ProductListSerializer,
    ProductWriteSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    """
    /api/products/                     -> list (paginated, filterable, searchable, sortable)
    /api/products/<slug>/              -> retrieve
    /api/products/                     -> POST (staff only)
    /api/products/<slug>/              -> PUT/PATCH/DELETE (staff only)
    /api/products/<slug>/upload_image/ -> POST an image to this product (staff only)
    /api/products/featured/            -> curated featured products
    /api/products/bestsellers/         -> curated bestsellers
    /api/products/new-arrivals/        -> curated new arrivals
    /api/products/<slug>/related/      -> other products in the same category

    Query params:
      ?search=ring necklace         free-text search (name, description, sku)
      ?category=rings                filter by category slug
      ?material=gold                 filter by material
      ?gender=women
      ?min_price=1000&max_price=50000
      ?in_stock=true
      ?ordering=price / -price / -created_at / name
    """

    lookup_field = "slug"
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardResultsPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["name", "description", "sku"]
    ordering_fields = ["price", "created_at", "name"]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = Product.objects.select_related("category").prefetch_related("images", "reviews")

        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(is_active=True)

        return queryset

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        if self.action in ("create", "update", "partial_update"):
            return ProductWriteSerializer
        return ProductDetailSerializer

    @action(
        detail=True,
        methods=["post"],
        url_path="upload_image",
        parser_classes=[MultiPartParser, FormParser],
        permission_classes=[IsAdminUser],
    )
    def upload_image(self, request, slug=None):
        product = self.get_object()
        image = request.data.get("image")
        if not image:
            return Response({"image": "This field is required."}, status=status.HTTP_400_BAD_REQUEST)

        product_image = ProductImage.objects.create(
            product=product,
            image=image,
            alt_text=request.data.get("alt_text", product.name),
            is_primary=str(request.data.get("is_primary", "false")).lower() == "true",
            display_order=request.data.get("display_order", 0),
        )
        return Response(
            ProductImageSerializer(product_image).data, status=status.HTTP_201_CREATED
        )

    @action(
        detail=True,
        methods=["delete"],
        url_path=r"images/(?P<image_id>[^/.]+)",
        permission_classes=[IsAdminUser],
    )
    def delete_image(self, request, slug=None, image_id=None):
        product = self.get_object()
        deleted, _ = ProductImage.objects.filter(pk=image_id, product=product).delete()
        if not deleted:
            return Response({"detail": "Image not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"], permission_classes=[IsAdminUser])
    def low_stock(self, request):
        """
        GET /api/products/low_stock/ — staff only. Products at or below
        a low-stock threshold (excluding fully out-of-stock, which is
        its own clear state) — powers the admin dashboard's inventory
        alert.
        """
        threshold = int(request.query_params.get("threshold", 5))
        queryset = (
                    Product.objects.filter(
                        stock_quantity__lte=threshold,
                        is_active=True,
                    )
                    .select_related("category")
                    .order_by("stock_quantity")
                )
        serializer = ProductListSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        return self._curated_list(request, is_featured=True)

    @action(detail=False, methods=["get"], url_path="bestsellers")
    def bestsellers(self, request):
        return self._curated_list(request, is_bestseller=True)

    @action(detail=False, methods=["get"], url_path="new-arrivals")
    def new_arrivals(self, request):
        return self._curated_list(request, is_new_arrival=True)

    def _curated_list(self, request, **flags):
        queryset = self.get_queryset().filter(**flags)[:12]
        serializer = ProductListSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def related(self, request, slug=None):
        product = self.get_object()
        queryset = (
            self.get_queryset()
            .filter(category=product.category)
            .exclude(pk=product.pk)[:8]
        )
        serializer = ProductListSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data)
