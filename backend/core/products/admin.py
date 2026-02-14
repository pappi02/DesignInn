"""
Admin configuration for Products app
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductVariant, ProductImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin interface for product categories"""
    list_display = ('name', 'slug', 'is_active', 'order', 'product_count')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    ordering = ['order', 'name']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'order')
        }),
        ('Media', {
            'fields': ('icon',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def product_count(self, obj):
        """Display count of products in category"""
        return obj.products.count()
    product_count.short_description = 'Active Products'


class ProductImageInline(admin.TabularInline):
    """Inline admin for product images"""
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'order')
    ordering = ['order']


class ProductVariantInline(admin.TabularInline):
    """Inline admin for product variants"""
    model = ProductVariant
    extra = 1
    fields = (
        'name', 'sku', 'price_modifier', 'stock', 'image', 'is_active'
    )
    ordering = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin interface for products with variants and images"""
    list_display = (
        'name', 'category', 'sku', 'image_preview', 'price',
        'stock_status', 'status', 'is_featured', 'created_at'
    )
    list_filter = (
        'status', 'category', 'is_featured', 'is_customizable',
        'created_at'
    )
    search_fields = ('name', 'slug', 'sku', 'description', 'tags')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = (
        'created_at', 'updated_at', 'image_preview_large',
        'discount_percentage', 'revenue'
    )
    inlines = [ProductVariantInline, ProductImageInline]
    actions = [
        'mark_featured', 'unmark_featured', 'mark_active',
        'mark_inactive', 'mark_discontinued'
    ]

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'category', 'sku', 'description',
                      'short_description')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'compare_price', 'cost', 'stock_quantity',
                      'discount_percentage')
        }),
        ('Media', {
            'fields': ('image', 'image_preview_large')
        }),
        ('Customization & Features', {
            'fields': ('is_customizable', 'tags')
        }),
        ('Status & Visibility', {
            'fields': ('status', 'is_featured')
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

    def image_preview(self, obj):
        """Show small image in list view"""
        if obj.image:
            return format_html(
                '<img src="{}" width="50" height="50" '
                'style="object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Image'

    def image_preview_large(self, obj):
        """Show larger image in detail view"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 300px; '
                'max-height: 300px; object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return 'No image'
    image_preview_large.short_description = 'Image Preview'

    def stock_status(self, obj):
        """Color-code stock availability"""
        if obj.stock_quantity > 0:
            color = '#28a745'  # Green
            text = f'{obj.stock_quantity} in stock'
        else:
            color = '#dc3545'  # Red
            text = 'Out of Stock'
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, text
        )
    stock_status.short_description = 'Stock'

    def discount_percentage(self, obj):
        """Display discount percentage"""
        if obj.compare_price:
            discount = obj.get_discount_percentage()
            return f'{discount}%'
        return '-'
    discount_percentage.short_description = 'Discount %'

    def revenue(self, obj):
        """Calculate potential revenue"""
        if obj.cost:
            profit = obj.price - obj.cost
            margin = (profit / obj.price * 100) if obj.price else 0
            return f'${profit:.2f} margin ({margin:.1f}%)'
        return '-'
    revenue.short_description = 'Profit Margin'

    # Bulk actions
    def mark_featured(self, request, queryset):
        """Mark selected products as featured"""
        updated = queryset.update(is_featured=True)
        self.message_user(request,
            f'{updated} product(s) marked as featured.')
    mark_featured.short_description = 'Mark as featured'

    def unmark_featured(self, request, queryset):
        """Remove featured status"""
        updated = queryset.update(is_featured=False)
        self.message_user(request,
            f'{updated} product(s) unmarked as featured.')
    unmark_featured.short_description = 'Unmark as featured'

    def mark_active(self, request, queryset):
        """Activate selected products"""
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} product(s) activated.')
    mark_active.short_description = 'Mark as active'

    def mark_inactive(self, request, queryset):
        """Deactivate selected products"""
        updated = queryset.update(status='inactive')
        self.message_user(request, f'{updated} product(s) inactivated.')
    mark_inactive.short_description = 'Mark as inactive'

    def mark_discontinued(self, request, queryset):
        """Mark products as discontinued"""
        updated = queryset.update(status='discontinued')
        self.message_user(request, f'{updated} product(s) discontinued.')
    mark_discontinued.short_description = 'Mark as discontinued'


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    """Admin interface for product variants"""
    list_display = (
        'name', 'product', 'sku', 'variant_price', 'stock',
        'is_active', 'created_at'
    )
    list_filter = ('product__category', 'is_active', 'created_at')
    search_fields = ('sku', 'name', 'product__name')
    readonly_fields = ('created_at', 'updated_at', 'variant_price')
    list_editable = ('stock', 'is_active')

    fieldsets = (
        ('Product Information', {
            'fields': ('product', 'name', 'sku')
        }),
        ('Pricing & Stock', {
            'fields': ('price_modifier', 'stock', 'variant_price')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def variant_price(self, obj):
        """Display the calculated variant price"""
        return f'${obj.get_variant_price():.2f}'
    variant_price.short_description = 'Final Price'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """Admin interface for product images"""
    list_display = ('product', 'image_preview', 'alt_text', 'order')
    list_filter = ('product__category', 'created_at')
    search_fields = ('product__name', 'alt_text')
    readonly_fields = ('created_at', 'image_preview_large')
    ordering = ['order', '-created_at']

    fieldsets = (
        ('Product Information', {
            'fields': ('product', 'order')
        }),
        ('Media', {
            'fields': ('image', 'image_preview_large', 'alt_text')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        """Show small image in list"""
        if obj.image:
            return format_html(
                '<img src="{}" width="50" height="50" '
                'style="object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Preview'

    def image_preview_large(self, obj):
        """Show larger image in detail"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 300px; '
                'max-height: 300px; object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return 'No image'
    image_preview_large.short_description = 'Image Preview'
