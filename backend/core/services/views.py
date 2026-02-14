"""
Services app views and viewsets for API endpoints
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend

from .models import Service
from .serializers import (
    ServiceListSerializer,
    ServiceDetailSerializer,
    ServiceCreateUpdateSerializer
)


class ServiceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Services
    - list: Get active services
    - retrieve: Get service details
    - create: Create service (admin only)
    - update: Update service (admin only)
    - featured: Get featured services
    - by_type: Get services by type
    """
    queryset = Service.objects.filter(status='active')
    permission_classes = [AllowAny]
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter
    ]
    filterset_fields = ['service_type', 'is_featured']
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['base_price', 'name', 'display_order']
    ordering = ['display_order', 'name']
    lookup_field = 'slug'

    def get_serializer_class(self):
        """Return appropriate serializer"""
        if self.action == 'retrieve':
            return ServiceDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ServiceCreateUpdateSerializer
        return ServiceListSerializer

    def get_permissions(self):
        """Set permissions"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]

    def get_queryset(self):
        """Filter queryset"""
        if self.request.user.is_staff:
            return Service.objects.all()
        return Service.objects.filter(status='active')

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        """Get featured services"""
        services = self.get_queryset().filter(is_featured=True)
        serializer = ServiceListSerializer(services, many=True)
        return Response({
            'success': True,
            'count': services.count(),
            'services': serializer.data
        })

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def by_type(self, request):
        """Get services by type"""
        service_type = request.query_params.get('type')
        if not service_type:
            return Response({
                'success': False,
                'error': 'Type parameter is required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        services = self.get_queryset().filter(service_type=service_type)
        serializer = ServiceListSerializer(services, many=True)
        return Response({
            'success': True,
            'type': service_type,
            'count': services.count(),
            'services': serializer.data
        })

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def all_types(self, request):
        """Get all service types with count"""
        from django.db.models import Count
        types = (
            self.get_queryset()
            .values('service_type', 'get_service_type_display')
            .annotate(count=Count('id'))
            .order_by('service_type')
        )
        return Response({
            'success': True,
            'service_types': list(types)
        })