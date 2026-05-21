from django.db import models


class Category(models.TextChoices):
    MARKERS = 'Маркеры', 'Маркеры'
    MASKS = 'Маски', 'Маски'
    TANKS = 'Баллоны', 'Баллоны'
    PROTECTION = 'Защита', 'Защита'
    ACCESSORIES = 'Аксессуары', 'Аксессуары'


class Badge(models.TextChoices):
    NEW = 'new', 'Новинка'
    SALE = 'sale', 'Скидка'
    HIT = 'hit', 'Хит'


class Product(models.Model):
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=Category.choices)
    emoji = models.CharField(max_length=10, default='🎯')
    price = models.PositiveIntegerField()
    old_price = models.PositiveIntegerField(null=True, blank=True)
    badge = models.CharField(max_length=10, choices=Badge.choices, null=True, blank=True)
    rating = models.PositiveSmallIntegerField(default=5)
    reviews = models.PositiveIntegerField(default=0)
    in_stock = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.brand} {self.name}"
