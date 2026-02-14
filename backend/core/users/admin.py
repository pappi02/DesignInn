from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom User Admin with additional fields"""
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Company Info', {
            'fields': ('phone', 'company_name', 'address', 'city', 'avatar', 'is_verified')
        }),
    )
    list_display = [
        'username', 'email', 'first_name', 'last_name', 'phone',
        'company_name', 'is_verified', 'is_staff', 'created_at'
    ]
    list_filter = BaseUserAdmin.list_filter + ('is_verified', 'created_at', 'is_staff')
    search_fields = BaseUserAdmin.search_fields + ('phone', 'company_name', 'city')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Company Info', {
            'fields': ('phone', 'company_name', 'address', 'city', 'avatar'),
            'description': 'Optional company and location information'
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_verified', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
