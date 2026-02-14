"""
Services app serializers for API responses
"""
from rest_framework import serializers
from .models import Service


class ServiceListSerializer(serializers.ModelSerializer):
    """Serializer for service listings"""
    service_type_display = serializers.CharField(
        source='get_service_type_display', read_only=True
    )

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'service_type', 'service_type_display',
            'short_description', 'base_price', 'price_range', 'icon',
            'is_featured', 'delivery_time', 'created_at'
        ]
        read_only_fields = fields


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Full serializer for service details"""
    service_type_display = serializers.CharField(
        source='get_service_type_display', read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'service_type', 'service_type_display',
            'description', 'short_description', 'base_price', 'price_range',
            'features', 'delivery_time', 'revision_rounds', 'icon',
            'is_featured', 'status', 'status_display', 'seo_title',
            'seo_description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ServiceCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating services (admin only)"""

    class Meta:
        model = Service
        fields = [
            'name', 'slug', 'service_type', 'description', 'short_description',
            'base_price', 'price_range', 'features', 'delivery_time',
            'revision_rounds', 'icon', 'is_featured', 'display_order',
            'status', 'seo_title', 'seo_description'
        ]