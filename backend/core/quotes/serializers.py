"""
Quote app serializers for API responses
"""
from rest_framework import serializers
from .models import Quote, QuoteComment


class QuoteCommentSerializer(serializers.ModelSerializer):
    """Serializer for quote comments"""
    author_name = serializers.CharField(
        source='author.get_full_name', read_only=True
    )

    class Meta:
        model = QuoteComment
        fields = [
            'id', 'author', 'author_name', 'is_admin', 'message', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class QuoteListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for quote listings"""
    service_display = serializers.CharField(
        source='get_service_type_display', read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )

    class Meta:
        model = Quote
        fields = [
            'id', 'quote_number', 'customer_name', 'service_type',
            'service_display', 'status', 'status_display', 'estimated_cost',
            'final_quote_amount', 'required_by', 'created_at'
        ]
        read_only_fields = fields


class QuoteDetailSerializer(serializers.ModelSerializer):
    """Full serializer for quote details"""
    comments = QuoteCommentSerializer(many=True, read_only=True)
    service_display = serializers.CharField(
        source='get_service_type_display', read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )
    reviewer_name = serializers.CharField(
        source='reviewed_by.get_full_name', read_only=True
    )

    class Meta:
        model = Quote
        fields = [
            'id', 'quote_id', 'quote_number', 'customer', 'customer_name',
            'customer_email', 'customer_phone', 'company_name', 'service_type',
            'service_display', 'description', 'specifications', 'attachment',
            'status', 'status_display', 'estimated_cost', 'final_quote_amount',
            'quote_notes', 'required_by', 'expected_completion', 'priority',
            'created_at', 'updated_at', 'reviewed_by', 'reviewer_name',
            'reviewed_at', 'comments'
        ]
        read_only_fields = [
            'id', 'quote_id', 'quote_number', 'created_at', 'updated_at',
            'reviewed_by', 'reviewed_at', 'comments'
        ]


class QuoteCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating quote requests"""

    class Meta:
        model = Quote
        fields = [
            'customer_name', 'customer_email', 'customer_phone',
            'company_name', 'service_type', 'description',
            'specifications', 'attachment', 'required_by'
        ]

    def validate_customer_email(self, value):
        """Validate email format"""
        return value

    def validate_required_by(self, value):
        """Validate required date is in future"""
        from django.utils.timezone import now
        if value and value < now().date():
            raise serializers.ValidationError(
                'Required date must be in the future.'
            )
        return value


class QuoteUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating quotes (admin only)"""

    class Meta:
        model = Quote
        fields = [
            'status', 'estimated_cost', 'final_quote_amount', 'quote_notes',
            'expected_completion', 'priority'
        ]


class QuoteStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating quote status"""
    status = serializers.ChoiceField(choices=Quote.STATUS_CHOICES)
    quote_amount = serializers.DecimalField(
        max_digits=12, decimal_places=2, required=False
    )
    notes = serializers.CharField(
        max_length=500, required=False, allow_blank=True
    )