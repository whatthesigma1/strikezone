from django.db import models
from strikezone.apps.products.models import Product


DELIVERY_CHOICES = [
    ('courier', 'Курьерская доставка'),
    ('free', 'Бесплатная доставка'),
    ('cdek', 'СДЭК — Пункт выдачи'),
    ('post', 'Почта России'),
    ('pickup', 'Самовывоз'),
]

PAYMENT_CHOICES = [
    ('card', 'Банковская карта'),
    ('sbp', 'СБП'),
    ('cash', 'Наличные'),
    ('invoice', 'По счёту'),
]

STATUS_CHOICES = [
    ('pending', 'Ожидает'),
    ('confirmed', 'Подтверждён'),
    ('shipping', 'Отправлен'),
    ('delivered', 'Доставлен'),
    ('cancelled', 'Отменён'),
]


class Order(models.Model):
    # Contact
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    comment = models.TextField(blank=True)

    # Delivery
    delivery_type = models.CharField(max_length=20, choices=DELIVERY_CHOICES)
    delivery_cost = models.PositiveIntegerField(default=0)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    street = models.CharField(max_length=200)
    house = models.CharField(max_length=50, blank=True)

    # Payment
    payment_type = models.CharField(max_length=20, choices=PAYMENT_CHOICES)

    # Promo
    promo_code = models.CharField(max_length=30, blank=True)
    promo_discount = models.DecimalField(max_digits=4, decimal_places=2, default=0)

    # Totals (stored for history)
    subtotal = models.PositiveIntegerField()
    total = models.PositiveIntegerField()

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    order_number = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Заказ {self.order_number} — {self.first_name} {self.last_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)   # snapshot at time of order
    product_price = models.PositiveIntegerField()
    quantity = models.PositiveSmallIntegerField()

    @property
    def line_total(self):
        return self.product_price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"
