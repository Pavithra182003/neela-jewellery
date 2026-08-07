import django_filters
from django.db.models import F
from django.db.models.functions import Coalesce

from .models import Product


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(method="filter_min_price")
    max_price = django_filters.NumberFilter(method="filter_max_price")

    category = django_filters.CharFilter(method="filter_category")
    gender = django_filters.CharFilter(method="filter_gender")

    material = django_filters.CharFilter(field_name="material", lookup_expr="iexact")
    in_stock = django_filters.BooleanFilter(method="filter_in_stock")

    class Meta:
        model = Product
        fields = [
            "category",
            "material",
            "gender",
            "is_featured",
            "is_bestseller",
            "is_new_arrival",
            "min_price",
            "max_price",
            "in_stock",
        ]

    def filter_min_price(self, queryset, name, value):
        queryset = queryset.annotate(
            selling_price=Coalesce(F("discount_price"), F("price"))
        )
        return queryset.filter(selling_price__gte=value)

    def filter_max_price(self, queryset, name, value):
        queryset = queryset.annotate(
            selling_price=Coalesce(F("discount_price"), F("price"))
        )
        return queryset.filter(selling_price__lte=value)

    def filter_category(self, queryset, name, value):
        categories = [x.strip() for x in value.split(",") if x.strip()]
        return queryset.filter(category__slug__in=categories)

    def filter_gender(self, queryset, name, value):
        genders = [x.strip() for x in value.split(",") if x.strip()]
        return queryset.filter(gender__in=genders)

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock_quantity__gt=0)
        return queryset.filter(stock_quantity=0)