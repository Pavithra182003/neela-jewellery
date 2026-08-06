from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.parsers import MultiPartParser, FormParser

from common.permissions import IsAdminOrReadOnly

from .models import Category
from .serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    /api/categories/                -> list top-level categories (with
                                        one level of nested subcategories)
    /api/categories/<slug>/         -> retrieve a single category
    /api/categories/                -> POST/PUT/PATCH/DELETE (staff only)

    Query params:
      ?search=ring        free-text search on name/description
      ?parent=null         only top-level categories (default for list)
      ?include_inactive=1   staff-only: also return inactive categories
    """

    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["parent", "is_active"]
    search_fields = ["name", "description"]

    def get_queryset(self):
        queryset = Category.objects.all().select_related("parent")

        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(is_active=True)

        # By default the list endpoint only returns top-level
        # categories; subcategories are nested inside each result.
        if self.action == "list" and "parent" not in self.request.query_params:
            queryset = queryset.filter(parent__isnull=True)

        return queryset.order_by("display_order", "name")
