from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'product_name', 'product_price', 'quantity']
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'full_name', 'phone', 'email',
        'delivery_type', 'payment_type', 'status_badge',
        'formatted_total', 'created_at'
    ]
    list_display_links = ['order_number', 'full_name']
    list_filter = ['status', 'delivery_type', 'payment_type', 'created_at']
    search_fields = ['order_number', 'first_name', 'last_name', 'phone', 'email']
    readonly_fields = ['order_number', 'created_at', 'subtotal', 'total', 'delivery_cost']
    ordering = ['-created_at']
    inlines = [OrderItemInline]

    fieldsets = (
        ('Заказ', {
            'fields': ('order_number', 'status', 'created_at')
        }),
        ('Покупатель', {
            'fields': ('first_name', 'last_name', 'phone', 'email', 'comment')
        }),
        ('Доставка', {
            'fields': ('delivery_type', 'delivery_cost', 'city', 'region', 'zip_code', 'street', 'house')
        }),
        ('Оплата', {
            'fields': ('payment_type', 'promo_code', 'promo_discount')
        }),
        ('Итого', {
            'fields': ('subtotal', 'total')
        }),
    )

    def full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'
    full_name.short_description = 'Покупатель'

    def status_badge(self, obj):
        colors = {
            'pending':   ('#fff3cd', '#856404'),
            'confirmed': ('#d4edda', '#155724'),
            'shipping':  ('#cce5ff', '#004085'),
            'delivered': ('#d1ecf1', '#0c5460'),
            'cancelled': ('#f8d7da', '#721c24'),
        }
        labels = {
            'pending':   'Ожидает',
            'confirmed': 'Подтверждён',
            'shipping':  'Отправлен',
            'delivered': 'Доставлен',
            'cancelled': 'Отменён',
        }
        bg, text = colors.get(obj.status, ('#eee', '#333'))
        label = labels.get(obj.status, obj.status)
        return format_html(
            '<span style="background:{};color:{};padding:3px 10px;'
            'border-radius:12px;font-size:12px;font-weight:bold">{}</span>',
            bg, text, label
        )
    status_badge.short_description = 'Статус'

    def formatted_total(self, obj):
        return format_html('<strong>{} ₽</strong>', obj.total)
    formatted_total.short_description = 'Итого'