from django.contrib import admin
from django.utils.html import format_html
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'colored_name', 'brand', 'category',
        'formatted_price', 'badge_display', 'stock_status', 'rating', 'reviews',
        'in_stock'
    ]
    list_display_links = ['id', 'colored_name']
    list_filter = ['category', 'badge', 'in_stock', 'brand']
    search_fields = ['name', 'brand']
    list_editable = ['in_stock']
    ordering = ['category', 'brand', 'name']

    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'brand', 'category', 'emoji')
        }),
        ('Цена', {
            'fields': ('price', 'old_price', 'badge')
        }),
        ('Рейтинг и наличие', {
            'fields': ('rating', 'reviews', 'in_stock')
        }),
    )

    def colored_name(self, obj):
        return format_html('<strong>{}</strong>', obj.name)
    colored_name.short_description = 'Название'

    def formatted_price(self, obj):
        if obj.old_price:
            return format_html(
                '<span style="color:red;text-decoration:line-through">{} ₽</span> '
                '<strong>{} ₽</strong>',
                obj.old_price, obj.price
            )
        return format_html('<strong>{} ₽</strong>', obj.price)
    formatted_price.short_description = 'Цена'

    def badge_display(self, obj):
        colors = {'new': '#e8f216', 'sale': '#ff3c2e', 'hit': '#7c3aed'}
        labels = {'new': 'Новинка', 'sale': 'Скидка', 'hit': 'Хит'}
        if obj.badge:
            color = colors.get(obj.badge, '#ccc')
            label = labels.get(obj.badge, obj.badge)
            return format_html(
                '<span style="background:{};color:{};padding:2px 8px;'
                'border-radius:4px;font-size:11px;font-weight:bold">{}</span>',
                color,
                '#000' if obj.badge == 'new' else '#fff',
                label
            )
        return '—'
    badge_display.short_description = 'Бейдж'

    def stock_status(self, obj):
        if obj.in_stock:
            return format_html('<span style="color:green;font-weight:bold">✓ В наличии</span>')
        return format_html('<span style="color:red;font-weight:bold">✗ Нет в наличии</span>')
    stock_status.short_description = 'Статус'