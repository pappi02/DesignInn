"""
Product app views and viewsets for API endpoints
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Category, Product, ProductVariant, ProductImage
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    ProductVariantSerializer,
    ProductVariantCreateUpdateSerializer,
    ProductImageSerializer
)


class CategoryViewSet(viewsets.ViewSet):
    """
    ViewSet for Category operations
    - list: Get all active categories
    - retrieve: Get category details with products
    """
    permission_classes = [AllowAny]

    def list(self, request):
        """List all active categories"""
        categories = Category.objects.filter(is_active=True).order_by('order')
        serializer = CategorySerializer(categories, many=True)
        return Response({
            'success': True,
            'count': categories.count(),
            'categories': serializer.data
        })

    def retrieve(self, request, pk=None):
        """Get category detail with products"""
        try:
            category = Category.objects.get(pk=pk)
            serializer = CategorySerializer(category)
            
            # Get products in category
            products = category.products.filter(status='active')
            product_serializer = ProductListSerializer(products, many=True)
            
            return Response({
                'success': True,
                'category': serializer.data,
                'product_count': products.count(),
                'products': product_serializer.data
            })
        except Category.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Category not found.'
            }, status=status.HTTP_404_NOT_FOUND)


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product management
    - list: Get all active products (paginated, searchable, filterable)
    - retrieve: Get product details
    - create: Create product (admin only)
    - update: Update product (admin only)
    - destroy: Delete product (admin only)
    - featured: Get featured products
    - search: Search products
    - related: Get related products
    """
    queryset = Product.objects.prefetch_related('variants', 'images')
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter
    ]
    filterset_fields = ['category', 'status', 'is_featured', 'is_customizable']
    search_fields = ['name', 'description', 'short_description', 'tags', 'sku']
    ordering_fields = ['price', 'created_at', 'name', 'stock_quantity']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'retrieve':
            return ProductDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductListSerializer

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy', 
                          'toggle_featured']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filter queryset based on user and action"""
        queryset = Product.objects.prefetch_related('variants', 'images')
        
        # Non-admin users see only active products
        if not self.request.user.is_staff:
            queryset = queryset.filter(status='active')
        
        # Filter by price range if provided
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=float(min_price))
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))
        
        # Filter in-stock products
        in_stock = self.request.query_params.get('in_stock')
        if in_stock and in_stock.lower() == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)
        
        return queryset

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        """Get featured products"""
        featured_products = self.get_queryset().filter(
            is_featured=True
        )[:6]
        serializer = ProductListSerializer(featured_products, many=True)
        return Response({
            'success': True,
            'count': featured_products.count(),
            'products': serializer.data
        })

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def newest(self, request):
        """Get newest products"""
        newest_products = self.get_queryset().order_by('-created_at')[:12]
        serializer = ProductListSerializer(newest_products, many=True)
        return Response({
            'success': True,
            'count': newest_products.count(),
            'products': serializer.data
        })

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def bestsellers(self, request):
        """Get best-selling products (popular)"""
        bestsellers = self.get_queryset()[:8]
        serializer = ProductListSerializer(bestsellers, many=True)
        return Response({
            'success': True,
            'count': bestsellers.count(),
            'products': serializer.data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def toggle_featured(self, request, slug=None):
        """Toggle featured status of product"""
        product = self.get_object()
        product.is_featured = not product.is_featured
        product.save()
        return Response({
            'success': True,
            'is_featured': product.is_featured,
            'message': f'Product is now {"featured" if product.is_featured else "not featured"}.'
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def toggle_status(self, request, slug=None):
        """Toggle product status"""
        product = self.get_object()
        new_status = request.data.get('status', 'active')
        
        if new_status not in dict(Product.STATUS_CHOICES):
            return Response({
                'success': False,
                'error': f'Invalid status. Choices: {", ".join(dict(Product.STATUS_CHOICES).keys())}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        product.status = new_status
        product.save()
        return Response({
            'success': True,
            'status': product.status,
            'message': f'Product status changed to {product.get_status_display()}.'
        })

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def related(self, request, slug=None):
        """Get related products from same category"""
        product = self.get_object()
        related = self.get_queryset().filter(
            category=product.category
        ).exclude(id=product.id)[:6]
        serializer = ProductListSerializer(related, many=True)
        return Response({
            'success': True,
            'count': related.count(),
            'products': serializer.data
        })


class ProductVariantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product Variants management
    Handle size, color, and other product variants
    Admin only
    """
    queryset = ProductVariant.objects.select_related('product')
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['product', 'is_active']
    search_fields = ['name', 'sku']

    def get_serializer_class(self):
        """Return appropriate serializer"""
        if self.action in ['create', 'update', 'partial_update']:
            return ProductVariantCreateUpdateSerializer
        return ProductVariantSerializer

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        """Adjust variant stock quantity"""
        variant = self.get_object()
        adjustment = request.data.get('adjustment', 0)
        
        try:
            adjustment = int(adjustment)
            new_stock = variant.stock + adjustment
            
            if new_stock < 0:
                return Response({
                    'success': False,
                    'error': 'Stock cannot be negative.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            variant.stock = new_stock
            variant.save()
            
            return Response({
                'success': True,
                'stock': variant.stock,
                'message': f'Stock adjusted to {variant.stock}.'
            })
        except (ValueError, TypeError):
            return Response({
                'success': False,
                'error': 'Invalid adjustment value.'
            }, status=status.HTTP_400_BAD_REQUEST)


class ProductImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product Images
    Handle gallery images for products
    Admin only
    """
    queryset = ProductImage.objects.select_related('product')
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product']
