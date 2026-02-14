"""
Admin configuration for Quotes app
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Quote, QuoteComment


class QuoteCommentInline(admin.TabularInline):
    """Inline admin for quote comments"""
    model = QuoteComment
    extra = 1
    fields = ('author', 'message', 'is_admin', 'created_at')
    readonly_fields = ('author', 'created_at')


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    """Admin interface for quotes"""
    list_display = (
        'quote_number', 'customer_name', 'service_display', 'status_badge',
        'estimated_cost', 'created_at'
    )
    list_filter = ('status', 'service_type', 'priority', 'created_at')
    search_fields = ('quote_number', 'customer_name', 'customer_email')
    readonly_fields = (
        'quote_id', 'quote_number', 'created_at', 'reviewed_at'
    )
    inlines = [QuoteCommentInline]
    actions = ['mark_reviewing', 'mark_quoted', 'mark_accepted', 'mark_rejected']

    fieldsets = (
        ('Quote Information', {
            'fields': ('quote_id', 'quote_number', 'created_at', 'status')
        }),
        ('Customer', {
            'fields': (
                'customer', 'customer_name', 'customer_email',
                'customer_phone', 'company_name'
            )
        }),
        ('Service Details', {
            'fields': (
                'service_type', 'description', 'specifications',
                'attachment'
            )
        }),
        ('Pricing & Timeline', {
            'fields': (
                'estimated_cost', 'final_quote_amount', 'required_by',
                'expected_completion'
            )
        }),
        ('Admin', {
            'fields': (
                'priority', 'quote_notes', 'reviewed_by', 'reviewed_at'
            ),
            'classes': ('collapse',)
        }),
    )

    def service_display(self, obj):
        """Display service type"""
        return obj.get_service_type_display()
    service_display.short_description = 'Service'

    def status_badge(self, obj):
        """Display status with color"""
        status_colors = {
            'submitted': '#FFC107',
            'reviewing': '#2196F3',
            'quoted': '#9C27B0',
            'accepted': '#4CAF50',
            'rejected': '#F44336',
            'cancelled': '#999999',
        }
        color = status_colors.get(obj.status, '#999999')
        return format_html(
            '<span style="background-color: {}; color: white; '
            'padding: 3px 10px; border-radius: 3px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def mark_reviewing(self, request, queryset):
        """Mark quotes as reviewing"""
        updated = queryset.update(status='reviewing')
        self.message_user(request, f'{updated} quote(s) marked for review.')
    mark_reviewing.short_description = 'Mark as reviewing'

    def mark_quoted(self, request, queryset):
        """Mark quotes as quoted"""
        updated = queryset.update(status='quoted')
        self.message_user(request, f'{updated} quote(s) quoted.')
    mark_quoted.short_description = 'Mark as quoted'

    def mark_accepted(self, request, queryset):
        """Mark quotes as accepted"""
        updated = queryset.update(status='accepted')
        self.message_user(request, f'{updated} quote(s) accepted.')
    mark_accepted.short_description = 'Mark as accepted'

    def mark_rejected(self, request, queryset):
        """Mark quotes as rejected"""
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} quote(s) rejected.')
    mark_rejected.short_description = 'Mark as rejected'


@admin.register(QuoteComment)
class QuoteCommentAdmin(admin.ModelAdmin):
    """Admin interface for quote comments"""
    list_display = ('quote', 'author', 'is_admin', 'created_at')
    list_filter = ('is_admin', 'created_at')
    search_fields = ('quote__quote_number', 'message')
    readonly_fields = ('created_at',)