from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class CustomUserAdmin(BaseUserAdmin):
    list_display = [
        'username', 'email', 'full_name', 'is_active',
        'is_staff', 'date_joined', 'last_login'
    ]
    list_filter = ['is_active', 'is_staff', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']

    def full_name(self, obj):
        name = f'{obj.first_name} {obj.last_name}'.strip()
        return name if name else '—'
    full_name.short_description = 'Имя'


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)