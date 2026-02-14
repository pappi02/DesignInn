"""
Portfolio app serializers for API responses
"""
from rest_framework import serializers
from .models import PortfolioProject, PortfolioImage


class PortfolioImageSerializer(serializers.ModelSerializer):
    """Serializer for portfolio images"""

    class Meta:
        model = PortfolioImage
        fields = ['id', 'image', 'caption', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']


class PortfolioProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for project listings"""
    category_display = serializers.CharField(
        source='get_category_display', read_only=True
    )

    class Meta:
        model = PortfolioProject
        fields = [
            'id', 'title', 'slug', 'category', 'category_display',
            'featured_image', 'client_name', 'is_featured',
            'views_count', 'created_at'
        ]
        read_only_fields = fields


class PortfolioProjectDetailSerializer(serializers.ModelSerializer):
    """Full serializer for project details"""
    images = PortfolioImageSerializer(many=True, read_only=True)
    category_display = serializers.CharField(
        source='get_category_display', read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )

    class Meta:
        model = PortfolioProject
        fields = [
            'id', 'title', 'slug', 'description', 'category', 'category_display',
            'client_name', 'featured_image', 'overview', 'process', 'results',
            'status', 'status_display', 'is_featured', 'tags', 'images',
            'views_count', 'created_at', 'updated_at',
            'seo_title', 'seo_description'
        ]
        read_only_fields = [
            'id', 'views_count', 'created_at', 'updated_at'
        ]


class PortfolioProjectCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating projects (admin only)"""

    class Meta:
        model = PortfolioProject
        fields = [
            'title', 'slug', 'description', 'category', 'client_name',
            'featured_image', 'overview', 'process', 'results', 'status',
            'is_featured', 'tags', 'seo_title', 'seo_description'
        ]