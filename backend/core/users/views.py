"""
User views and viewsets for API endpoints
"""
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

from .serializers import (
    UserSerializer,
    UserDetailSerializer,
    UserCreateSerializer,
    UserUpdateSerializer
)

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    User management viewset
    Handles full CRUD operations on users
    """
    queryset = User.objects.all().order_by('-created_at')
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        elif self.action == 'retrieve':
            return UserDetailSerializer
        return UserSerializer

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action == 'create':
            permission_classes = [AllowAny]
        elif self.action in ['list', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filter queryset based on user permissions"""
        if self.request.user.is_staff:
            return User.objects.all().order_by('-created_at')
        return User.objects.filter(id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        """Create a new user"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate token for new user
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'success': True,
            'user': UserDetailSerializer(user).data,
            'token': token.key,
            'message': 'User registered successfully.'
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """User registration endpoint"""
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate token
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'success': True,
            'user': UserDetailSerializer(user).data,
            'token': token.key,
            'message': 'Registered successfully. Welcome to DesignInn!'
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user profile"""
        user = request.user
        serializer = UserDetailSerializer(user)
        return Response({
            'success': True,
            'user': serializer.data
        })

    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def profile_update(self, request):
        """Update current user profile"""
        user = request.user
        serializer = UserUpdateSerializer(
            user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'success': True,
            'user': UserDetailSerializer(user).data,
            'message': 'Profile updated successfully.'
        })

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """Change password for authenticated user"""
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        new_password_confirm = request.data.get('new_password_confirm')

        if not all([old_password, new_password, new_password_confirm]):
            return Response({
                'success': False,
                'error': 'All password fields are required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({
                'success': False,
                'error': 'Current password is incorrect.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if new_password != new_password_confirm:
            return Response({
                'success': False,
                'error': 'New passwords do not match.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({
                'success': False,
                'error': 'New password must be at least 8 characters.'
            }, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({
            'success': True,
            'message': 'Password changed successfully.'
        })

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def verify_token(self, request):
        """Verify if a token is valid"""
        token_str = request.data.get('token')
        
        if not token_str:
            return Response({
                'success': False,
                'valid': False,
                'error': 'Token is required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=token_str)
            user = token.user

            if not user.is_active:
                return Response({
                    'success': False,
                    'valid': False,
                    'error': 'User account is inactive.'
                }, status=status.HTTP_401_UNAUTHORIZED)

            return Response({
                'success': True,
                'valid': True,
                'user': UserDetailSerializer(user).data
            })
        except Token.DoesNotExist:
            return Response({
                'success': False,
                'valid': False,
                'error': 'Invalid token.'
            }, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Logout user by deleting their token"""
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response({
                'success': True,
                'message': 'Logged out successfully.'
            })
        except Token.DoesNotExist:
            return Response({
                'success': False,
                'error': 'No active token found.'
            }, status=status.HTTP_400_BAD_REQUEST)
