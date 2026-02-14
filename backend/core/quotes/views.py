"""
Quote app views and viewsets for API endpoints
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.timezone import now

from .models import Quote, QuoteComment
from .serializers import (
    QuoteListSerializer,
    QuoteDetailSerializer,
    QuoteCreateSerializer,
    QuoteUpdateSerializer,
    QuoteStatusUpdateSerializer,
    QuoteCommentSerializer
)


class QuoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Quote management
    - list: Get quotes (customers see own, admin sees all)
    - create: Submit new quote request
    - retrieve: Get quote details
    - update: Update quote (admin only)
    - partial_update: Partially update quote (admin)
    - my_quotes: Get current user's quotes
    - update_status: Update quote status (admin)
    - add_comment: Add comment to quote
    - accept: Accept quote as customer
    - reject: Reject quote as customer
    """
    queryset = Quote.objects.prefetch_related('comments')
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter
    ]
    filterset_fields = ['status', 'service_type']
    search_fields = ['quote_number', 'customer_name', 'description']
    ordering_fields = ['created_at', 'priority', 'estimated_cost']
    ordering = ['-priority', '-created_at']

    def get_permissions(self):
        """Override permissions"""
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Filter quotes by user permissions"""
        user = self.request.user

        if not user.is_authenticated:
            return Quote.objects.none()

        if user.is_staff:
            return Quote.objects.all()

        return Quote.objects.filter(customer=user)

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'retrieve':
            return QuoteDetailSerializer
        elif self.action == 'create':
            return QuoteCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return QuoteUpdateSerializer
        elif self.action == 'update_status':
            return QuoteStatusUpdateSerializer
        return QuoteListSerializer

    def perform_create(self, serializer):
        """Save quote with customer if authenticated"""
        if self.request.user.is_authenticated:
            serializer.save(customer=self.request.user)
        else:
            serializer.save()

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_quotes(self, request):
        """Get current user's quotes"""
        quotes = Quote.objects.filter(customer=request.user).order_by(
            '-created_at'
        )
        page = self.paginate_queryset(quotes)
        if page is not None:
            serializer = QuoteListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = QuoteListSerializer(quotes, many=True)
        return Response({
            'success': True,
            'count': quotes.count(),
            'quotes': serializer.data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        """Update quote status (admin only)"""
        quote = self.get_object()
        serializer = QuoteStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data['status']
        notes = serializer.validated_data.get('notes', '')
        quote_amount = serializer.validated_data.get('quote_amount')

        # Update quote
        quote.status = new_status
        if quote_amount:
            quote.final_quote_amount = quote_amount
        quote.reviewed_by = request.user
        quote.reviewed_at = now()
        if notes:
            quote.quote_notes = notes
        quote.save()

        # Add comment
        if notes:
            QuoteComment.objects.create(
                quote=quote,
                author=request.user,
                is_admin=True,
                message=notes
            )

        return Response({
            'success': True,
            'message': f'Quote status updated to {quote.get_status_display()}.',
            'quote': QuoteDetailSerializer(quote).data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, pk=None):
        """Add comment to quote"""
        quote = self.get_object()

        # Verify ownership
        if quote.customer != request.user and not request.user.is_staff:
            return Response({
                'success': False,
                'error': 'Not authorized to comment on this quote.'
            }, status=status.HTTP_403_FORBIDDEN)

        message = request.data.get('message')
        if not message:
            return Response({
                'success': False,
                'error': 'Message is required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        comment = QuoteComment.objects.create(
            quote=quote,
            author=request.user,
            is_admin=request.user.is_staff,
            message=message
        )

        return Response({
            'success': True,
            'message': 'Comment added successfully.',
            'comment': QuoteCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def accept(self, request, pk=None):
        """Accept quote (customer only)"""
        quote = self.get_object()

        # Verify ownership
        if quote.customer != request.user and not request.user.is_staff:
            return Response({
                'success': False,
                'error': 'Not authorized to accept this quote.'
            }, status=status.HTTP_403_FORBIDDEN)

        if quote.status != 'quoted':
            return Response({
                'success': False,
                'error': 'Only quoted quotes can be accepted.'
            }, status=status.HTTP_400_BAD_REQUEST)

        quote.status = 'accepted'
        quote.save()

        QuoteComment.objects.create(
            quote=quote,
            author=request.user,
            is_admin=False,
            message='Quote accepted by customer'
        )

        return Response({
            'success': True,
            'message': 'Quote accepted successfully.',
            'quote': QuoteDetailSerializer(quote).data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        """Reject quote (customer only)"""
        quote = self.get_object()

        # Verify ownership
        if quote.customer != request.user and not request.user.is_staff:
            return Response({
                'success': False,
                'error': 'Not authorized to reject this quote.'
            }, status=status.HTTP_403_FORBIDDEN)

        if quote.status != 'quoted':
            return Response({
                'success': False,
                'error': 'Only quoted quotes can be rejected.'
            }, status=status.HTTP_400_BAD_REQUEST)

        reason = request.data.get('reason', '')
        quote.status = 'rejected'
        quote.save()

        message = 'Quote rejected by customer'
        if reason:
            message += f': {reason}'

        QuoteComment.objects.create(
            quote=quote,
            author=request.user,
            is_admin=False,
            message=message
        )

        return Response({
            'success': True,
            'message': 'Quote rejected.'
        })

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def pending_review(self, request):
        """Get quotes pending admin review"""
        quotes = Quote.objects.filter(status='submitted').order_by(
            '-priority', 'created_at'
        )
        page = self.paginate_queryset(quotes)
        if page is not None:
            serializer = QuoteListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = QuoteListSerializer(quotes, many=True)
        return Response({
            'success': True,
            'count': quotes.count(),
            'quotes': serializer.data
        })