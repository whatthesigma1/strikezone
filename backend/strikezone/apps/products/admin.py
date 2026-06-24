from django.contrib import admin
from django.utils.html import format_html

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "brand",
        "category",
        "price",
        "old_price",
        "discount_badge",
        "badge",
        "in_stock",
        "created_at",
    ]
    list_display_links = ["id", "name"]
    list_editable = ["price", "old_price", "badge", "in_stock"]
    list_filter = ["category", "badge", "in_stock", "brand", "created_at"]
    search_fields = ["name", "brand"]
    ordering = ["category", "brand", "name"]
    readonly_fields = ["created_at", "price_preview"]
    list_per_page = 25
    save_on_top = True
    empty_value_display = "—"

    fieldsets = (
        (
            "Основная информация",
            {
                "fields": ("name", "brand", "category", "emoji"),
            },
        ),
        (
            "Цена и промо",
            {
                "fields": ("price", "old_price", "price_preview", "badge"),
            },
        ),
        (
            "Рейтинг и остатки",
            {
                "fields": ("rating", "reviews", "in_stock"),
            },
        ),
        (
            "Служебная информация",
            {
                "fields": ("created_at",),
            },
        ),
    )

    @admin.display(description="Скидка")
    def discount_badge(self, obj):
        if not obj.old_price or obj.old_price <= obj.price:
            return "—"

        discount_percent = round((obj.old_price - obj.price) / obj.old_price * 100)
        return format_html(
            '<span style="background:#ffede9;color:#c0362c;padding:3px 8px;'
            'border-radius:999px;font-weight:700;">-{}%</span>',
            discount_percent,
        )

    @admin.display(description="Превью цены")
    def price_preview(self, obj):
        if not obj.pk:
            return "Сохраните товар, чтобы увидеть предпросмотр."

        if obj.old_price:
            return format_html(
                '<span style="color:#9a9a9a;text-decoration:line-through;">{} ₽</span> '
                '<strong style="margin-left:8px;">{} ₽</strong>',
                obj.old_price,
                obj.price,
            )

        return format_html("<strong>{} ₽</strong>", obj.price)
