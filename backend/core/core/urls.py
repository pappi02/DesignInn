"""
Main URL configuration for DesignInn project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # API URLs
    path('api/v1/', include([
        path('users/', include('users.urls', namespace='users')),
        path('products/', include('products.urls', namespace='products')),
        path('orders/', include('orders.urls', namespace='orders')),
        path('quotes/', include('quotes.urls', namespace='quotes')),
        path('portfolio/', include('portfolio.urls', namespace='portfolio')),
        path('services/', include('services.urls', namespace='services')),
    ])),

    # DRF admin token auth
    path('api-token-auth/', include('rest_framework.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
