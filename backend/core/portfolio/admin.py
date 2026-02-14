"""
Admin configuration for Portfolio app
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import PortfolioProject, PortfolioImage


class PortfolioImageInline(admin.TabularInline):
    """Inline admin for portfolio images"""
    model = PortfolioImage
    extra = 1
    fields = ('image', 'caption', 'order')
    ordering = ['order']


@admin.register(PortfolioProject)
class PortfolioProjectAdmin(admin.ModelAdmin):
    """Admin interface for portfolio projects"""
    list_display = (
        'title', 'category_display', 'image_preview', 'status_badge',
        'is_featured', 'views_count', 'created_at'
    )
    list_filter = ('status', 'category', 'is_featured', 'created_at')
    search_fields = ('title', 'slug', 'description', 'tags')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at', 'views_count', 'image_large')
    inlines = [PortfolioImageInline]
    actions = ['mark_published', 'mark_draft', 'mark_featured', 'unmark_featured']

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'category', 'client_name', 'author')
        }),
        ('Content', {
            'fields': ('description', 'overview', 'process', 'results')
        }),
        ('Media', {
            'fields': ('featured_image', 'image_large')
        }),
        ('Status & Visibility', {
            'fields': ('status', 'is_featured', 'tags')
        }),
        ('SEO', {
            'fields': ('seo_title', 'seo_description'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('views_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def category_display(self, obj):
        """Display category"""
        return obj.get_category_display()
    category_display.short_description = 'Category'

    def status_badge(self, obj):
        """Display status with color"""
        status_colors = {
            'draft': '#FFC107',
            'published': '#4CAF50',
            'archived': '#999999',
        }
        color = status_colors.get(obj.status, '#999999')
        return format_html(
            '<span style="background-color: {}; color: white; '
            'padding: 3px 10px; border-radius: 3px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def image_preview(self, obj):
        """Show small image in list"""
        if obj.featured_image:
            return format_html(
                '<img src="{}" width="50" height="50" '
                'style="object-fit: cover; border-radius: 4px;" />',
                obj.featured_image.url
            )
        return '-'
    image_preview.short_description = 'Image'

    def image_large(self, obj):
        """Show larger image in detail"""
        if obj.featured_image:
            return format_html(
                '<img src="{}" style="max-width: 400px; '
                'max-height: 300px; object-fit: cover; border-radius: 4px;" />',
                obj.featured_image.url
            )
        return 'No image'
    image_large.short_description = 'Featured Image'

    def mark_published(self, request, queryset):
        """Mark projects as published"""
        updated = queryset.update(status='published')
        self.message_user(request, f'{updated} project(s) published.')
    mark_published.short_description = 'Mark as published'

    def mark_draft(self, request, queryset):
        """Mark projects as draft"""
        updated = queryset.update(status='draft')
        self.message_user(request, f'{updated} project(s) marked as draft.')
    mark_draft.short_description = 'Mark as draft'

    def mark_featured(self, request, queryset):
        """Mark projects as featured"""
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} project(s) marked as featured.')
    mark_featured.short_description = 'Mark as featured'

    def unmark_featured(self, request, queryset):
        """Unmark projects as featured"""
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} project(s) unmarked.')
    unmark_featured.short_description = 'Unmark as featured'


@admin.register(PortfolioImage)
class PortfolioImageAdmin(admin.ModelAdmin):
    """Admin interface for portfolio images"""
    list_display = ('project', 'caption', 'order', 'image_preview')
    list_filter = ('project', 'created_at')
    search_fields = ('project__title', 'caption')
    ordering = ['order']

    def image_preview(self, obj):
        """Show image preview"""
        if obj.image:
            return format_html(
                '<img src="{}" width="50" height="50" '
                'style="object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Preview'