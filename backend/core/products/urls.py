"""
URL Configuration for Products App.
Provides RESTful endpoints for managing and retrieving products.

Endpoints:
- GET /api/v1/products/categories/ - List all categories
- GET /api/v1/products/categories/{id}/ - Get category details
- GET /api/v1/products/ - List products (paginated, filterable)
- GET /api/v1/products/featured/ - Get featured products
- GET /api/v1/products/newest/ - Get newest products
- GET /api/v1/products/bestsellers/ - Get bestsellers
- GET /api/v1/products/{slug}/ - Get product details
- GET /api/v1/products/{slug}/related/ - Get related products
- POST /api/v1/products/{slug}/toggle_featured/ - Toggle featured (admin)
- POST /api/v1/products/{slug}/toggle_status/ - Toggle status (admin)
- GET /api/v1/products/variants/ - List variants (admin)
- GET /api/v1/products/images/ - List product images (admin)
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    ProductViewSet,
    ProductVariantViewSet,
    ProductImageViewSet,
)

# 🔹 REQUIRED for namespacing
app_name = "products"

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"variants", ProductVariantViewSet, basename="product-variant")
router.register(r"images", ProductImageViewSet, basename="product-image")
router.register(r"", ProductViewSet, basename="product")

urlpatterns = [
    path("", include(router.urls)),
]