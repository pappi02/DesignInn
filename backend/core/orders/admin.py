"""
Admin configuration for Orders app
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem, OrderStatusLog, OrderFeedback


class OrderItemInline(admin.TabularInline):
    """Inline admin for order items"""
    model = OrderItem
    extra = 0
    fields = ('product', 'variant', 'quantity', 'unit_price', 'item_total')
    readonly_fields = ('product', 'variant', 'item_total')
    can_delete = False


class OrderStatusLogInline(admin.TabularInline):
    """Inline admin for order status logs"""
    model = OrderStatusLog
    extra = 0
    fields = ('timestamp', 'status', 'changed_by', 'notes')
    readonly_fields = ('timestamp', 'status', 'changed_by')
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin interface for orders"""
    list_display = (
        'order_number', 'customer_name', 'status_badge', 'total_amount',
        'item_count', 'delivery_type', 'created_at'
    )
    list_filter = ('status', 'delivery_type', 'created_at')
    search_fields = ('order_number', 'customer_name', 'customer_email')
    readonly_fields = (
        'order_number', 'order_id', 'subtotal', 'total_amount', 'item_count',
        'created_at', 'updated_at'
    )
    inlines = [OrderItemInline, OrderStatusLogInline]
    actions = [
        'mark_confirmed', 'mark_processing', 'mark_ready',
        'mark_shipped', 'mark_delivered'
    ]

    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'order_id', 'customer', 'created_at', 'updated_at')
        }),
        ('Customer Details', {
            'fields': ('customer_name', 'customer_email', 'customer_phone')
        }),
        ('Delivery Information', {
            'fields': (
                'delivery_type', 'delivery_address', 'delivery_city',
                'delivery_postal_code', 'expected_delivery'
            )
        }),
        ('Pricing', {
            'fields': (
                'subtotal', 'discount_amount', 'tax_amount',
                'delivery_fee', 'total_amount'
            )
        }),
        ('Status & Notes', {
            'fields': ('status', 'notes')
        }),
    )

    def status_badge(self, obj):
        """Display status with color coding"""
        status_colors = {
            'pending': '#FFC107',
            'confirmed': '#2196F3',
            'processing': '#FF9800',
            'ready': '#9C27B0',
            'shipped': '#00BCD4',
            'delivered': '#4CAF50',
            'cancelled': '#F44336',
        }
        color = status_colors.get(obj.status, '#999999')
        return format_html(
            '<span style="background-color: {}; color: white; '
            'padding: 3px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def item_count(self, obj):
        """Display item count"""
        return obj.item_count
    item_count.short_description = 'Items'

    # Bulk actions
    def mark_confirmed(self, request, queryset):
        """Mark orders as confirmed"""
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'{updated} order(s) marked as confirmed.')
    mark_confirmed.short_description = 'Mark as confirmed'

    def mark_processing(self, request, queryset):
        """Mark orders as processing"""
        updated = queryset.update(status='processing')
        self.message_user(request, f'{updated} order(s) marked as processing.')
    mark_processing.short_description = 'Mark as processing'

    def mark_ready(self, request, queryset):
        """Mark orders as ready"""
        updated = queryset.update(status='ready')
        self.message_user(request, f'{updated} order(s) marked as ready.')
    mark_ready.short_description = 'Mark as ready'

    def mark_shipped(self, request, queryset):
        """Mark orders as shipped"""
        updated = queryset.update(status='shipped')
        self.message_user(request, f'{updated} order(s) marked as shipped.')
    mark_shipped.short_description = 'Mark as shipped'

    def mark_delivered(self, request, queryset):
        """Mark orders as delivered"""
        updated = queryset.update(status='delivered')
        self.message_user(request, f'{updated} order(s) marked as delivered.')
    mark_delivered.short_description = 'Mark as delivered'


@admin.register(OrderFeedback)
class OrderFeedbackAdmin(admin.ModelAdmin):
    """Admin interface for order feedback"""
    list_display = ('order', 'rating_stars', 'would_recommend', 'created_at')
    list_filter = ('rating', 'would_recommend', 'created_at')
    search_fields = ('order__order_number', 'comment')
    readonly_fields = ('order', 'created_at')

    fieldsets = (
        ('Order', {
            'fields': ('order', 'created_at')
        }),
        ('Feedback', {
            'fields': ('rating', 'comment', 'would_recommend')
        }),
    )

    def rating_stars(self, obj):
        """Display rating as stars"""
        return '⭐' * obj.rating
    rating_stars.short_description = 'Rating'