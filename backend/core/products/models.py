"""
Product models for merchandise, merchandise variants, and categories
"""
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from common.utils import TimestampedModel
from common.validators import validate_file_size, validate_file_type


def validate_price(value):
    """Validate that price is positive"""
    if value < 0:
        raise ValidationError('Price must be a positive number.')


class Category(models.Model):
    """Product category for organizing merchandise"""
    name = models.CharField(
        max_length=100, unique=True,
        help_text='Category name (e.g., T-Shirts, Mugs, etc.)'
    )
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(
        upload_to='categories/',
        blank=True, null=True
    )
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(
        default=0,
        help_text='Display order in listings'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name


class Product(models.Model):
    """Product representing merchandise items"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('discontinued', 'Discontinued'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT,
        related_name='products'
    )
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    image = models.ImageField(
        upload_to='products/',
        help_text='Product main image'
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    compare_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text='Original price for discount display',
        validators=[MinValueValidator(0)]
    )
    cost = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text='Cost to produce (admin only)',
        validators=[MinValueValidator(0)]
    )
    stock_quantity = models.IntegerField(
        default=0, help_text='Available stock'
    )
    sku = models.CharField(
        max_length=50, unique=True,
        help_text='Stock Keeping Unit'
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='draft'
    )
    is_featured = models.BooleanField(default=False)
    is_customizable = models.BooleanField(
        default=True,
        help_text='Can be customized by customers'
    )
    tags = models.CharField(
        max_length=500, blank=True,
        help_text='Comma-separated tags for search'
    )
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category']),
            models.Index(fields=['status']),
            models.Index(fields=['sku']),
        ]

    def __str__(self):
        return self.name

    def is_in_stock(self):
        """Check if product is available"""
        return self.stock_quantity > 0

    def get_discount_percentage(self):
        """Calculate discount percentage if compare_price exists"""
        if not self.compare_price:
            return 0
        discount = (self.compare_price - self.price) / self.compare_price * 100
        return round(discount, 2)

    def reduce_stock(self, quantity):
        """Reduce stock after purchase"""
        if self.stock_quantity < quantity:
            raise ValidationError(
                f'Insufficient stock. Available: {self.stock_quantity}'
            )
        self.stock_quantity -= quantity
        self.save()

    def increase_stock(self, quantity):
        """Increase stock (for order cancellations)"""
        self.stock_quantity += quantity
        self.save()


class ProductVariant(models.Model):
    """
    Product variant (size, color, etc.)
    Allows same product to have different options
    """
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE,
        related_name='variants'
    )
    name = models.CharField(
        max_length=100,
        help_text='Variant name (e.g., "Red Small", "Blue Large")'
    )
    sku = models.CharField(
        max_length=50, unique=True,
        help_text='Variant-specific SKU'
    )
    price_modifier = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        validators=[MinValueValidator(0)],
        help_text='Price adjustment for this variant'
    )
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    image = models.ImageField(
        upload_to='product_variants/',
        blank=True, null=True,
        help_text='Variant-specific image'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['product']),
            models.Index(fields=['sku']),
        ]
        verbose_name_plural = 'Product Variants'

    def __str__(self):
        return f"{self.product.name} - {self.name}"

    def get_variant_price(self):
        """Get final price including modifier"""
        return self.product.price + self.price_modifier

    def is_in_stock(self):
        """Check if variant is in stock"""
        return self.stock > 0


class ProductImage(models.Model):
    """Additional product images for gallery"""
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(
        upload_to='products_gallery/'
    )
    alt_text = models.CharField(
        max_length=200, blank=True,
        help_text='Alt text for accessibility'
    )
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        indexes = [
            models.Index(fields=['product']),
        ]
        verbose_name_plural = 'Product Images'

    def __str__(self):
        return f"Image for {self.product.name}"
