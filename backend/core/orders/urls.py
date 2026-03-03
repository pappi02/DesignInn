from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet


app_name = "orders"
"""
URL Configuration for Orders App.
Provides RESTful endpoints for order management.

Endpoints:
- POST /api/v1/orders/ - Create new order
- GET /api/v1/orders/ - List orders
- GET /api/v1/orders/my_orders/ - Get user's orders
- GET /api/v1/orders/{id}/ - Get order details
- GET /api/v1/orders/{id}/track/ - Track order status
- POST /api/v1/orders/{id}/update_status/ - Update status (admin)
- POST /api/v1/orders/{id}/feedback/ - Add feedback to order
- DELETE /api/v1/orders/{id}/cancel/ - Cancel order
"""

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]
