"""
Product app serializers for API responses
"""
from rest_framework import serializers
from .models import Category, Product, ProductVariant, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    """Category serializer with product count"""
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'icon',
            'is_active', 'order', 'product_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_product_count(self, obj):
        """Count active products in category"""
        return obj.products.filter(status='active').count()


class ProductImageSerializer(serializers.ModelSerializer):
    """Product image serializer"""

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Product variant serializer with pricing and stock"""
    variant_price = serializers.SerializerMethodField()
    is_in_stock = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = [
            'id', 'name', 'sku', 'price_modifier', 'stock',
            'image', 'is_active', 'variant_price', 'is_in_stock',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_variant_price(self, obj):
        """Calculate final price with modifier"""
        return float(obj.get_variant_price())

    def get_is_in_stock(self, obj):
        """Check if variant is in stock"""
        return obj.is_in_stock()


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight product serializer for list views"""
    category_name = serializers.CharField(
        source='category.name', read_only=True
    )
    discount_percentage = serializers.SerializerMethodField()
    is_in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'price', 'compare_price',
            'image', 'category', 'category_name', 'is_featured',
            'is_in_stock', 'status', 'discount_percentage',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_discount_percentage(self, obj):
        """Get discount percentage"""
        return obj.get_discount_percentage()

    def get_is_in_stock(self, obj):
        """Check if product is in stock"""
        return obj.is_in_stock()


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full product serializer with variants and images"""
    category = CategorySerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    discount_percentage = serializers.SerializerMethodField()
    is_in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'description',
            'short_description', 'price', 'compare_price', 'image',
            'stock_quantity', 'sku', 'status', 'is_featured',
            'is_customizable', 'discount_percentage', 'is_in_stock',
            'variants', 'images', 'tags', 'seo_title', 'seo_description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_discount_percentage(self, obj):
        """Get discount percentage if compare price exists"""
        return obj.get_discount_percentage()

    def get_is_in_stock(self, obj):
        """Check if product is in stock"""
        return obj.is_in_stock()


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating products"""

    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'category', 'description', 'short_description',
            'image', 'price', 'compare_price', 'cost', 'stock_quantity',
            'sku', 'status', 'is_featured', 'is_customizable', 'tags',
            'seo_title', 'seo_description'
        ]

    def validate_slug(self, value):
        """Validate slug is unique"""
        product = self.instance
        if product:
            # Updating - exclude current product
            if Product.objects.filter(slug=value).exclude(id=product.id).exists():
                raise serializers.ValidationError('Slug already exists.')
        else:
            # Creating
            if Product.objects.filter(slug=value).exists():
                raise serializers.ValidationError('Slug already exists.')
        return value

    def validate_sku(self, value):
        """Validate SKU is unique"""
        product = self.instance
        if product:
            # Updating - exclude current product
            if Product.objects.filter(sku=value).exclude(id=product.id).exists():
                raise serializers.ValidationError('SKU already exists.')
        else:
            # Creating
            if Product.objects.filter(sku=value).exists():
                raise serializers.ValidationError('SKU already exists.')
        return value


class ProductVariantCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating product variants"""

    class Meta:
        model = ProductVariant
        fields = [
            'name', 'sku', 'price_modifier', 'stock', 'image', 'is_active'
        ]

    def validate_sku(self, value):
        """Validate SKU is unique"""
        variant = self.instance
        if variant:
            # Updating - exclude current variant
            if ProductVariant.objects.filter(sku=value).exclude(id=variant.id).exists():
                raise serializers.ValidationError('SKU already exists.')
        else:
            # Creating
            if ProductVariant.objects.filter(sku=value).exists():
                raise serializers.ValidationError('SKU already exists.')
        return value
