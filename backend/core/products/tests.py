"""
Comprehensive test suite for Products app.

Tests cover:
- Category model and admin
- Product model with pricing and status
- ProductVariant model with pricing modifiers
- ProductImage model with gallery
- Product serializers with nested relationships
- Product viewsets with custom actions
- Filtering, search, and pagination
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal

from .models import Category, Product, ProductVariant, ProductImage

User = get_user_model()


class CategoryModelTests(TestCase):
    """Test Category model creation and properties."""

    def setUp(self):
        self.category = Category.objects.create(
            name='T-Shirts',
            icon='shirt',
            order=1,
            is_active=True
        )

    def test_category_creation(self):
        """Test category is created with correct fields."""
        self.assertEqual(self.category.name, 'T-Shirts')
        self.assertEqual(self.category.icon, 'shirt')
        self.assertEqual(self.category.order, 1)
        self.assertTrue(self.category.is_active)

    def test_category_string_representation(self):
        """Test category __str__ method."""
        self.assertEqual(str(self.category), 'T-Shirts')

    def test_category_unique_name(self):
        """Test that category names must be unique."""
        with self.assertRaises(Exception):
            Category.objects.create(
                name='T-Shirts',
                icon='shirt2'
            )

    def test_category_timestamps(self):
        """Test that timestamps are automatically set."""
        self.assertIsNotNone(self.category.created_at)
        self.assertIsNotNone(self.category.updated_at)

    def test_category_ordering(self):
        """Test categories can be ordered."""
        category2 = Category.objects.create(name='Mugs', icon='mug', order=2)
        categories = Category.objects.all().order_by('order')
        self.assertEqual(list(categories), [self.category, category2])



class ProductModelTests(TestCase):
    """Test Product model creation, validation, and relationships."""
    """Test cases for Product model"""

    def setUp(self):
        """Create test data"""
        self.category = Category.objects.create(name='Apparel')
        self.product = Product.objects.create(
            name='Premium T-Shirt',
            category=self.category,
            price=Decimal('25.00'),
            description='High-quality custom t-shirt',
            stock=100,
            available_sizes=['S', 'M', 'L', 'XL'],
            available_colors=['Black', 'White', 'Red']
        )

    def test_product_creation(self):
        """Test product is created correctly"""
        self.assertEqual(self.product.name, 'Premium T-Shirt')
        self.assertEqual(self.product.category, self.category)
        self.assertEqual(self.product.price, Decimal('25.00'))
        self.assertEqual(self.product.stock, 100)

    def test_product_slug_auto_generation(self):
        """Test slug is auto-generated from name"""
        self.assertEqual(self.product.slug, 'premium-t-shirt')

    def test_product_is_in_stock(self):
        """Test is_in_stock property"""
        self.assertTrue(self.product.is_in_stock)
        self.product.stock = 0
        self.assertFalse(self.product.is_in_stock)

    def test_product_string_representation(self):
        """Test product string representation"""
        self.assertEqual(str(self.product), 'Premium T-Shirt')

    def test_product_featured_status(self):
        """Test is_featured field"""
        self.assertFalse(self.product.is_featured)
        self.product.is_featured = True
        self.product.save()
        self.assertTrue(self.product.is_featured)

    def test_product_available_sizes_json(self):
        """Test available_sizes JSON field"""
        self.assertEqual(self.product.available_sizes, ['S', 'M', 'L', 'XL'])
        self.product.available_sizes.append('XXL')
        self.product.save()
        self.product.refresh_from_db()
        self.assertIn('XXL', self.product.available_sizes)

    def test_product_available_colors_json(self):
        """Test available_colors JSON field"""
        self.assertEqual(self.product.available_colors, ['Black', 'White', 'Red'])

class ProductVariantModelTest(TestCase):
    """Test cases for ProductVariant model"""

    def setUp(self):
        """Create test data"""
        self.category = Category.objects.create(name='Apparel')
        self.product = Product.objects.create(
            name='Custom Jersey',
            category=self.category,
            price=Decimal('45.00'),
            stock=50,
            available_sizes=['S', 'M', 'L', 'XL'],
            available_colors=['Blue', 'Red']
        )

    def test_variant_creation(self):
        """Test variant is created correctly"""
        variant = ProductVariant.objects.create(
            product=self.product,
            size='M',
            color='Blue',
            sku='JERSEY-BLUE-M',
            stock=20
        )
        self.assertEqual(variant.product, self.product)
        self.assertEqual(variant.size, 'M')
        self.assertEqual(variant.color, 'Blue')
        self.assertEqual(variant.sku, 'JERSEY-BLUE-M')

    def test_variant_unique_constraint(self):
        """Test unique constraint on product+size+color"""
        ProductVariant.objects.create(
            product=self.product,
            size='M',
            color='Blue',
            sku='JERSEY-BLUE-M-1'
        )
        with self.assertRaises(Exception):
            # Attempting to create duplicate variant should raise IntegrityError
            ProductVariant.objects.create(
                product=self.product,
                size='M',
                color='Blue',
                sku='JERSEY-BLUE-M-2'
            )

    def test_variant_total_price(self):
        """Test total_price property with price modifier"""
        variant = ProductVariant.objects.create(
            product=self.product,
            size='XL',
            color='Red',
            sku='JERSEY-RED-XL',
            stock=15,
            price_modifier=Decimal('5.00')
        )
        expected_price = self.product.price + variant.price_modifier
        self.assertEqual(variant.total_price, expected_price)

    def test_variant_total_price_without_modifier(self):
        """Test total_price property without modifier (should equal product price)"""
        variant = ProductVariant.objects.create(
            product=self.product,
            size='S',
            color='Blue',
            sku='JERSEY-BLUE-S'
        )
        self.assertEqual(variant.total_price, self.product.price)

    def test_variant_is_in_stock(self):
        """Test is_in_stock property"""
        variant = ProductVariant.objects.create(
            product=self.product,
            size='L',
            color='Blue',
            sku='JERSEY-BLUE-L',
            stock=10
        )
        self.assertTrue(variant.is_in_stock)
        
        variant.stock = 0
        self.assertFalse(variant.is_in_stock)

    def test_variant_string_representation(self):
        """Test variant string representation"""
        variant = ProductVariant.objects.create(
            product=self.product,
            size='M',
            color='Blue',
            sku='JERSEY-BLUE-M'
        )
        expected = f'{self.product.name} - Blue / M'
        self.assertEqual(str(variant), expected)

    def test_variant_inactive_status(self):
        """Test variant can be deactivated"""
        variant = ProductVariant.objects.create(
            product=self.product,
            size='M',
            color='Red',
            sku='JERSEY-RED-M'
        )
        self.assertTrue(variant.is_active)
        variant.is_active = False
        variant.save()
        self.assertFalse(variant.is_active)
