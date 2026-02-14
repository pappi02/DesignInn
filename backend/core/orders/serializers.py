"""
Order app serializers for API responses
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Order, OrderItem, OrderStatusLog, OrderFeedback
from products.models import Product, ProductVariant
from products.serializers import ProductListSerializer, ProductVariantSerializer

User = get_user_model()


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for individual order items"""
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    variant_id = serializers.IntegerField(write_only=True, required=False)
    item_total = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_id', 'variant', 'variant_id',
            'quantity', 'unit_price', 'item_total',
            'design_file', 'special_instructions', 'created_at'
        ]
        read_only_fields = ['id', 'item_total', 'created_at']


class OrderItemCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating order items"""
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = OrderItem
        fields = [
            'product_id', 'variant_id', 'quantity', 'unit_price',
            'design_file', 'special_instructions'
        ]

    def validate_product_id(self, value):
        """Validate product exists"""
        if not Product.objects.filter(id=value).exists():
            raise serializers.ValidationError('Product not found.')
        return value

    def validate_quantity(self, value):
        """Validate quantity is positive"""
        if value < 1:
            raise serializers.ValidationError(
                'Quantity must be at least 1.'
            )
        return value


class OrderStatusLogSerializer(serializers.ModelSerializer):
    """Serializer for order status change logs"""
    changed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = OrderStatusLog
        fields = [
            'id', 'status', 'timestamp', 'changed_by_name', 'notes'
        ]
        read_only_fields = fields

    def get_changed_by_name(self, obj):
        """Get full name of user who changed status"""
        if obj.changed_by:
            return obj.changed_by.get_full_name()
        return 'System'


class OrderFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for order feedback/reviews"""

    class Meta:
        model = OrderFeedback
        fields = [
            'id', 'rating', 'comment', 'would_recommend', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class OrderListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for order listings"""
    item_count = serializers.SerializerMethodField()
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'status', 'status_display',
            'total_amount', 'item_count', 'created_at', 'expected_delivery'
        ]
        read_only_fields = fields

    def get_item_count(self, obj):
        """Get total items count"""
        return obj.item_count


class OrderDetailSerializer(serializers.ModelSerializer):
    """Full serializer for order details"""
    items = OrderItemSerializer(many=True, read_only=True)
    status_logs = OrderStatusLogSerializer(many=True, read_only=True)
    feedback = OrderFeedbackSerializer(read_only=True)
    item_count = serializers.SerializerMethodField()
    is_completed = serializers.BooleanField(read_only=True)
    can_be_cancelled = serializers.BooleanField(read_only=True)
    can_be_shipped = serializers.BooleanField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'order_id', 'customer_name', 'customer_email',
            'customer_phone', 'delivery_type', 'delivery_address',
            'delivery_city', 'delivery_postal_code', 'status',
            'notes', 'subtotal', 'discount_amount', 'tax_amount',
            'delivery_fee', 'total_amount', 'items', 'status_logs',
            'feedback', 'created_at', 'updated_at', 'expected_delivery',
            'item_count', 'is_completed', 'can_be_cancelled', 'can_be_shipped'
        ]
        read_only_fields = [
            'id', 'order_number', 'order_id', 'subtotal', 'discount_amount',
            'tax_amount', 'delivery_fee', 'total_amount', 'items',
            'status_logs', 'feedback', 'created_at', 'updated_at'
        ]

    def get_item_count(self, obj):
        """Get total items count"""
        return obj.item_count


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders"""
    items = OrderItemCreateSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            'customer_name', 'customer_email', 'customer_phone',
            'delivery_type', 'delivery_address', 'delivery_city',
            'delivery_postal_code', 'notes', 'items'
        ]

    def validate(self, data):
        """Validate order data"""
        if not data.get('items'):
            raise serializers.ValidationError('Order must have at least one item.')
        return data

    def create(self, validated_data):
        """Create order with items"""
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(**validated_data)

        # Create order items
        for item_data in items_data:
            product_id = item_data.pop('product_id')
            variant_id = item_data.pop('variant_id', None)

            try:
                product = Product.objects.get(id=product_id)
                variant = None
                if variant_id:
                    variant = ProductVariant.objects.get(
                        id=variant_id, product=product
                    )

                # Use product price if unit_price not provided
                if not item_data.get('unit_price'):
                    item_data['unit_price'] = product.price

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    variant=variant,
                    **item_data
                )
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    f'Product with id {product_id} not found.'
                )
            except ProductVariant.DoesNotExist:
                raise serializers.ValidationError(
                    f'Variant with id {variant_id} not found for product.'
                )

        # Recalculate totals
        order.save()

        # Create initial status log
        OrderStatusLog.objects.create(
            order=order,
            status='pending',
            notes='Order created'
        )

        return order


class OrderUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating orders (admin only)"""

    class Meta:
        model = Order
        fields = [
            'delivery_type', 'delivery_address', 'delivery_city',
            'delivery_postal_code', 'notes', 'tax_amount', 'delivery_fee',
            'discount_amount', 'expected_delivery'
        ]

    def update(self, instance, validated_data):
        """Update order"""
        # Recalculate totals after update
        instance = super().update(instance, validated_data)
        instance.save()
        return instance


class OrderStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating order status"""
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
    notes = serializers.CharField(
        max_length=500, required=False, allow_blank=True
    )
