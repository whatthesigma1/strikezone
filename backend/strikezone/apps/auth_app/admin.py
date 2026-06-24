from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User


class CustomUserAdmin(BaseUserAdmin):
    list_display = [
        "id",
        "username",
        "email",
        "full_name",
        "is_active",
        "is_staff",
        "date_joined",
        "last_login",
    ]
    list_display_links = ["id", "username"]
    list_filter = ["is_active", "is_staff", "is_superuser", "date_joined", "last_login"]
    search_fields = ["username", "email", "first_name", "last_name"]
    ordering = ["-date_joined"]
    readonly_fields = ["date_joined", "last_login"]

    fieldsets = (
        (
            "Профиль",
            {
                "fields": ("username", "password"),
            },
        ),
        (
            "Контакты",
            {
                "fields": ("first_name", "last_name", "email"),
            },
        ),
        (
            "Права доступа",
            {
                "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions"),
            },
        ),
        (
            "Активность",
            {
                "fields": ("last_login", "date_joined"),
            },
        ),
    )
    add_fieldsets = (
        (
            "Новый пользователь",
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2", "is_staff", "is_active"),
            },
        ),
    )

    @admin.display(description="Имя")
    def full_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        return full_name or "—"


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

admin.site.site_header = "Strikezone Admin"
admin.site.site_title = "Strikezone Admin"
admin.site.index_title = "Управление магазином"
