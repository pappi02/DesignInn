from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='api-docs'),

    # API Authentication
    path('api/auth/token/', obtain_auth_token, name='api-token-auth'),

    # API V1 Endpoints
    path('api/v1/', include([
        path('users/', include('users.urls')),
        path('products/', include('products.urls')),
        path('orders/', include('orders.urls')),
        path('quotes/', include('quotes.urls')),
        path('portfolio/', include('portfolio.urls')),
        path('services/', include('services.urls')),
    ])),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# API Root
admin.site.site_header = 'DesignInn Admin Panel'
admin.site.site_title = 'DesignInn'
admin.site.index_title = 'Welcome to DesignInn Administration'
