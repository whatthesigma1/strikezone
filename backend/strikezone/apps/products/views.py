from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import ProductSerializer


class ProductListView(generics.ListAPIView):
    """
    GET /api/products/
    Query params:
      - category: filter by category name (e.g. "Маркеры")
      - brand: filter by brand
      - search: search by name or brand
    """
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'brand', 'badge', 'in_stock']
    search_fields = ['name', 'brand']

    def get_queryset(self):
        return Product.objects.filter(in_stock=True)


class CategoryListView(APIView):
    """GET /api/products/categories/ — returns distinct categories with counts"""
    def get(self, request):
        from django.db.models import Count
        cats = (
            Product.objects
            .filter(in_stock=True)
            .values('category')
            .annotate(count=Count('id'))
            .order_by('category')
        )
        data = [{'name': c['category'], 'count': c['count']} for c in cats]
        return Response(data)
