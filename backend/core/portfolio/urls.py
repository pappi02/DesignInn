"""
URL Configuration for Portfolio App
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioProjectViewSet, PortfolioImageViewSet

app_name = "portfolio"

router = DefaultRouter()
router.register(r'images', PortfolioImageViewSet, basename='portfolio-image')
router.register(r'', PortfolioProjectViewSet, basename='portfolio-project')

urlpatterns = [
    path('', include(router.urls)),
]