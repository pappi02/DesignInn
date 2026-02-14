"""
Admin configuration for Services app
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """Admin interface for services"""
    list_display = (
        'name', 'service_type_display', 'base_price', 'status_badge',
        'is_featured', 'delivery_time', 'created_at'
    )
    list_filter = ('status', 'service_type', 'is_featured', 'created_at')
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at', 'icon_preview')
    actions = ['mark_active', 'mark_unavailable', 'mark_discontinued', 
               'mark_featured', 'unmark_featured']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'service_type', 'description',
                      'short_description')
        }),
        ('Pricing', {
            'fields': ('base_price', 'price_range')
        }),
        ('Features & Details', {
            'fields': ('features', 'delivery_time', 'revision_rounds')
        }),
        ('Media', {
            'fields': ('icon', 'icon_preview')
        }),
        ('Status & Visibility', {
            'fields': ('status', 'is_featured', 'display_order')
        }),
        ('SEO', {
            'fields': ('seo_title', 'seo_description'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def service_type_display(self, obj):
        """Display service type"""
        return obj.get_service_type_display()
    service_type_display.short_description = 'Service Type'

    def status_badge(self, obj):
        """Display status with color"""
        status_colors = {
            'active': '#4CAF50',
            'unavailable': '#FFC107',
            'discontinued': '#F44336',
        }
        color = status_colors.get(obj.status, '#999999')
        return format_html(
            '<span style="background-color: {}; color: white; '
            'padding: 3px 10px; border-radius: 3px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def icon_preview(self, obj):
        """Show icon preview"""
        if obj.icon:
            return format_html(
                '<img src="{}" width="100" height="100" '
                'style="object-fit: contain; border-radius: 4px;" />',
                obj.icon.url
            )
        return 'No icon'
    icon_preview.short_description = 'Icon Preview'

    def mark_active(self, request, queryset):
        """Mark services as active"""
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} service(s) marked as active.')
    mark_active.short_description = 'Mark as active'

    def mark_unavailable(self, request, queryset):
        """Mark services as unavailable"""
        updated = queryset.update(status='unavailable')
        self.message_user(request, f'{updated} service(s) marked unavailable.')
    mark_unavailable.short_description = 'Mark as unavailable'

    def mark_discontinued(self, request, queryset):
        """Mark services as discontinued"""
        updated = queryset.update(status='discontinued')
        self.message_user(request, f'{updated} service(s) discontinued.')
    mark_discontinued.short_description = 'Mark as discontinued'

    def mark_featured(self, request, queryset):
        """Mark services as featured"""
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} service(s) marked featured.')
    mark_featured.short_description = 'Mark as featured'

    def unmark_featured(self, request, queryset):
        """Unmark services as featured"""
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} service(s) unmarked.')
    unmark_featured.short_description = 'Unmark as featured'