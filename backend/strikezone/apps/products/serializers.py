from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'category', 'emoji',
            'price', 'old_price', 'badge', 'rating', 'reviews', 'in_stock',
        ]
