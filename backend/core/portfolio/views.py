"""
Portfolio app views and viewsets for API endpoints
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend

from .models import PortfolioProject, PortfolioImage
from .serializers import (
    PortfolioProjectListSerializer,
    PortfolioProjectDetailSerializer,
    PortfolioProjectCreateUpdateSerializer,
    PortfolioImageSerializer
)


class PortfolioProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Portfolio Projects
    - list: Get published projects
    - retrieve: Get project details
    - create: Create project (admin only)
    - update: Update project (admin only)
    - featured: Get featured projects
    - by_category: Get projects by category
    """
    queryset = PortfolioProject.objects.filter(status='published')
    permission_classes = [AllowAny]
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter
    ]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'views_count', 'title']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        """Return appropriate serializer"""
        if self.action == 'retrieve':
            return PortfolioProjectDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return PortfolioProjectCreateUpdateSerializer
        return PortfolioProjectListSerializer

    def get_permissions(self):
        """Set permissions"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]

    def get_queryset(self):
        """Filter queryset"""
        if self.request.user.is_staff:
            return PortfolioProject.objects.all()
        return PortfolioProject.objects.filter(status='published')

    def retrieve(self, request, *args, **kwargs):
        """Increment views when project is retrieved"""
        response = super().retrieve(request, *args, **kwargs)
        project = self.get_object()
        project.increment_views()
        return response

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        """Get featured projects"""
        projects = self.get_queryset().filter(is_featured=True)[:6]
        serializer = PortfolioProjectListSerializer(projects, many=True)
        return Response({
            'success': True,
            'count': projects.count(),
            'projects': serializer.data
        })

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def by_category(self, request):
        """Get projects grouped by category"""
        category = request.query_params.get('category')
        if not category:
            return Response({
                'success': False,
                'error': 'Category parameter is required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        projects = self.get_queryset().filter(category=category)
        serializer = PortfolioProjectListSerializer(projects, many=True)
        return Response({
            'success': True,
            'category': category,
            'count': projects.count(),
            'projects': serializer.data
        })

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def latest(self, request):
        """Get latest projects"""
        projects = self.get_queryset()[:12]
        serializer = PortfolioProjectListSerializer(projects, many=True)
        return Response({
            'success': True,
            'count': projects.count(),
            'projects': serializer.data
        })


class PortfolioImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Portfolio Images (admin only)
    """
    queryset = PortfolioImage.objects.all()
    serializer_class = PortfolioImageSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project']