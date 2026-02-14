"""
Order models for managing customer orders and merchandise sales
"""
from django.db import models
from django.core.validators import MinValueValidator
from django.utils.timezone import now
from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.core.exceptions import ValidationError

from products.models import Product, ProductVariant
import uuid

User = get_user_model()
DELIVERY_TYPE_CHOICES = [
    ('local_pickup', 'Local Pickup'),
    ('home_delivery', 'Home Delivery'),
    ('express', 'Express Delivery'),
]


class Order(models.Model):
    """
    Order model for customer orders
    Tracks order status, customer info, delivery details, and totals
    """
    STATUS_CHOICES = [
        ('pending', 'Pending - Awaiting confirmation'),
        ('confirmed', 'Confirmed - Payment received'),
        ('processing', 'Processing - In production'),
        ('ready', 'Ready - Awaiting pickup/dispatch'),
        ('shipped', 'Shipped - On the way'),
        ('delivered', 'Delivered - Order complete'),
        ('cancelled', 'Cancelled'),
    ]

    # Identifiers
    order_number = models.CharField(
        max_length=20, unique=True, db_index=True,
        help_text='Auto-generated order ID'
    )
    order_id = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False
    )

    # Customer Information
    customer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='orders'
    )
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)

    # Delivery Information
    delivery_type = models.CharField(
        max_length=20, choices=DELIVERY_TYPE_CHOICES,
        default='home_delivery'
    )
    delivery_address = models.TextField()
    delivery_city = models.CharField(max_length=50)
    delivery_postal_code = models.CharField(
        max_length=10, null=True, blank=True
    )

    # Order Status
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending',
        db_index=True
    )
    notes = models.TextField(
        blank=True,
        help_text='Special instructions or notes'
    )

    # Pricing (auto-calculated)
    subtotal = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        validators=[MinValueValidator(0)],
        help_text='Total before discounts and taxes'
    )
    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        validators=[MinValueValidator(0)]
    )
    tax_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00,
        validators=[MinValueValidator(0)]
    )
    delivery_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00,
        validators=[MinValueValidator(0)]
    )
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        validators=[MinValueValidator(0)]
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    expected_delivery = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['order_number']),
        ]

    def __str__(self):
        return f'Order {self.order_number} - {self.customer_name}'

    def save(self, *args, **kwargs):
        """Auto-generate order number and calculate totals"""
        if not self.order_number:
            count = Order.objects.count() + 1
            self.order_number = f'ORD-{now().strftime("%Y%m%d")}-{count:05d}'
        
        # Calculate subtotal from items
        self.subtotal = self.calculate_subtotal()
        
        # Calculate total: subtotal - discount + tax + delivery
        self.total_amount = (
            self.subtotal - self.discount_amount +
            self.tax_amount + self.delivery_fee
        )
        
        super().save(*args, **kwargs)

    def calculate_subtotal(self):
        """Calculate subtotal from order items"""
        total = self.items.aggregate(
            total=Sum(models.F('unit_price') * models.F('quantity'),
                     output_field=models.DecimalField())
        )['total'] or 0
        return total

    @property
    def item_count(self):
        """Get total quantity of items in order"""
        count = self.items.aggregate(
            total=Sum('quantity')
        )['total'] or 0
        return count

    @property
    def is_completed(self):
        """Check if order is completed"""
        return self.status in ['delivered', 'cancelled']

    @property
    def can_be_cancelled(self):
        """Check if order can be cancelled"""
        return self.status in ['pending', 'confirmed']

    @property
    def can_be_shipped(self):
        """Check if order can be marked as shipped"""
        return self.status == 'ready'

    def mark_as_shipped(self):
        """Mark order as shipped"""
        if self.can_be_shipped:
            self.status = 'shipped'
            self.save()
            OrderStatusLog.objects.create(
                order=self,
                status='shipped',
                notes='Order marked as shipped'
            )
        else:
            raise ValidationError('Order cannot be marked as shipped.')

    def cancel_order(self):
        """Cancel order and restore stock"""
        if self.can_be_cancelled:
            for item in self.items.all():
                if item.variant:
                    item.variant.stock += item.quantity
                    item.variant.save()
            self.status = 'cancelled'
            self.save()
            OrderStatusLog.objects.create(
                order=self,
                status='cancelled',
                notes='Order cancelled and stock restored'
            )
        else:
            raise ValidationError('Order cannot be cancelled.')


class OrderItem(models.Model):
    """
    Individual item in an order
    Links to product variant with quantity and customization details
    """
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='items'
    )
    product = models.ForeignKey(
        Product, on_delete=models.PROTECT,
        related_name='order_items'
    )
    variant = models.ForeignKey(
        ProductVariant, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='order_items'
    )

    # Item Details
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        default=1
    )

    # Pricing (stored for historical record)
    unit_price = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text='Price at time of order'
    )

    # Customization
    design_file = models.FileField(
        upload_to='designs/%Y/%m/%d/', null=True, blank=True,
        help_text='Design file for printing'
    )
    special_instructions = models.TextField(
        blank=True,
        help_text='Custom instructions (names, numbers, text, etc.)'
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        verbose_name_plural = 'Order Items'

    def __str__(self):
        variant_str = f' - {self.variant.name}' if self.variant else ''
        return f'{self.product.name}{variant_str} x {self.quantity}'

    @property
    def item_total(self):
        """Calculate total for this order item"""
        return self.unit_price * self.quantity


class OrderStatusLog(models.Model):
    """
    Log of status changes for an order
    Provides audit trail of order progression
    """
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='status_logs'
    )
    status = models.CharField(
        max_length=20, choices=Order.STATUS_CHOICES
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        help_text='Staff member who made the change'
    )
    notes = models.TextField(
        blank=True,
        help_text='Reason for status change'
    )

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'Order Status Logs'
        indexes = [
            models.Index(fields=['order', '-timestamp']),
        ]

    def __str__(self):
        return f'{self.order.order_number} → {self.status}'


class OrderFeedback(models.Model):
    """
    Customer feedback/review on completed orders
    Optional but helps with service improvement and ratings
    """
    RATING_CHOICES = [(i, '⭐ ' * i) for i in range(1, 6)]

    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, related_name='feedback'
    )
    rating = models.IntegerField(
        choices=RATING_CHOICES,
        help_text='Order satisfaction rating'
    )
    comment = models.TextField(blank=True)
    would_recommend = models.BooleanField(
        default=True,
        help_text='Would the customer recommend DesignInn?'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Order Feedback'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f'Feedback for {self.order.order_number} - {self.rating}⭐'
