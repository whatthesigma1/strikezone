import random
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from strikezone.apps.products.models import Product

PROMO_CODES = {
    'STRIKE10': 0.10,
}


class OrderItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    # Contact
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone = serializers.CharField()
    email = serializers.EmailField()
    comment = serializers.CharField(required=False, allow_blank=True)

    # Delivery
    delivery_type = serializers.ChoiceField(choices=[
        'courier', 'free', 'cdek', 'post', 'pickup'
    ])
    city = serializers.CharField()
    region = serializers.CharField(required=False, allow_blank=True)
    zip_code = serializers.CharField(required=False, allow_blank=True)
    street = serializers.CharField()
    house = serializers.CharField(required=False, allow_blank=True)

    # Payment
    payment_type = serializers.ChoiceField(choices=['card', 'sbp', 'cash', 'invoice'])

    # Promo
    promo_code = serializers.CharField(required=False, allow_blank=True)

    # Cart
    items = OrderItemSerializer(many=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Корзина пуста")
        return value


class OrderCreateView(APIView):
    """POST /api/orders/"""
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # Resolve products
        delivery_costs = {
            'courier': 350, 'free': 0, 'cdek': 400,
            'post': 300, 'pickup': 0,
        }
        delivery_cost = delivery_costs.get(data['delivery_type'], 0)

        subtotal = 0
        items_to_create = []
        for item in data['items']:
            try:
                product = Product.objects.get(id=item['product_id'], in_stock=True)
            except Product.DoesNotExist:
                return Response(
                    {'detail': f"Товар {item['product_id']} не найден"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            line = product.price * item['quantity']
            subtotal += line
            items_to_create.append((product, item['quantity']))

        # Promo
        promo_code = data.get('promo_code', '').upper()
        discount_rate = PROMO_CODES.get(promo_code, 0)
        discount = round(subtotal * discount_rate)
        total = subtotal + delivery_cost - discount

        order_number = f"SZ-{random.randint(10000, 99999)}"

        order = Order.objects.create(
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data['phone'],
            email=data['email'],
            comment=data.get('comment', ''),
            delivery_type=data['delivery_type'],
            delivery_cost=delivery_cost,
            city=data['city'],
            region=data.get('region', ''),
            zip_code=data.get('zip_code', ''),
            street=data['street'],
            house=data.get('house', ''),
            payment_type=data['payment_type'],
            promo_code=promo_code,
            promo_discount=discount_rate,
            subtotal=subtotal,
            total=total,
            order_number=order_number,
        )

        for product, qty in items_to_create:
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=f"{product.brand} {product.name}",
                product_price=product.price,
                quantity=qty,
            )

        return Response({
            'order_number': order.order_number,
            'total': order.total,
            'status': order.status,
        }, status=status.HTTP_201_CREATED)


class ValidatePromoView(APIView):
    """POST /api/orders/validate-promo/"""
    def post(self, request):
        code = request.data.get('code', '').upper()
        discount = PROMO_CODES.get(code)
        if discount:
            return Response({'valid': True, 'discount': discount, 'code': code})
        return Response({'valid': False}, status=status.HTTP_200_OK)
