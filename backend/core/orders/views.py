"""
Order app views and viewsets for API endpoints
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import ValidationError as DjangoValidationError

from .models import Order, OrderItem, OrderStatusLog, OrderFeedback
from .serializers import (
    OrderListSerializer,
    OrderDetailSerializer,
    OrderCreateSerializer,
    OrderUpdateSerializer,
    OrderStatusUpdateSerializer,
    OrderFeedbackSerializer,
    OrderStatusLogSerializer
)


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Order management
    - list: Get user's orders (customers) or all (admin)
    - create: Create new order
    - retrieve: Get order details
    - update: Update order (admin only)
    - destroy: Delete order (admin only)
    - my_orders: Get current user's orders
    - cancel: Cancel order
    - track: Get order tracking info
    - update_status: Update order status (admin)
    - feedback: Add feedback (customer)
    - mark_shipped: Mark as shipped (admin)
    """
    queryset = Order.objects.prefetch_related('items', 'status_logs')
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter
    ]
    filterset_fields = ['status', 'delivery_type']
    search_fields = ['order_number', 'customer_name', 'customer_email']
    ordering_fields = ['created_at', 'total_amount', 'status']
    ordering = ['-created_at']

    def get_permissions(self):
        """
        Override permissions:
        - create: AllowAny (guest orders allowed)
        - list: IsAuthenticated
        - others: IsAuthenticated (owner) or IsAdminUser
        """
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Filter orders by user permissions"""
        user = self.request.user
        
        if not user.is_authenticated:
            return Order.objects.none()
        
        if user.is_staff:
            return Order.objects.all()
        
        return Order.objects.filter(customer=user)

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'retrieve':
            return OrderDetailSerializer
        elif self.action == 'create':
            return OrderCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        elif self.action == 'update_status':
            return OrderStatusUpdateSerializer
        elif self.action == 'feedback':
            return OrderFeedbackSerializer
        return OrderListSerializer

    def perform_create(self, serializer):
        """Save order with customer if authenticated"""
        if self.request.user.is_authenticated:
            serializer.save(customer=self.request.user)
        else:
            serializer.save()

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_orders(self, request):
        """Get current user's orders"""
        orders = Order.objects.filter(customer=request.user).order_by('-created_at')
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = OrderListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = OrderListSerializer(orders, many=True)
        return Response({
            'success': True,
            'count': orders.count(),
            'orders': serializer.data
        })

    @action(detail=True, methods=['get'])
    def track(self, request, pk=None):
        """Get order tracking information"""
        order = self.get_object()
        serializer = OrderDetailSerializer(order)
        status_logs = OrderStatusLogSerializer(
            order.status_logs.all(), many=True
        )
        
        return Response({
            'success': True,
            'order': serializer.data,
            'status_history': status_logs.data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        """Update order status (admin only)"""
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data['status']
        notes = serializer.validated_data.get('notes', '')

        # Avoid duplicate status
        if order.status == new_status:
            return Response({
                'success': False,
                'error': 'Order already has this status.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Update status
        order.status = new_status
        order.save()

        # Log the change
        OrderStatusLog.objects.create(
            order=order,
            status=new_status,
            changed_by=request.user,
            notes=notes or f'Status updated to {order.get_status_display()}'
        )

        return Response({
            'success': True,
            'message': f'Order status updated to {order.get_status_display()}.',
            'order': OrderDetailSerializer(order).data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_shipped(self, request, pk=None):
        """Mark order as shipped (admin only)"""
        order = self.get_object()
        
        try:
            order.mark_as_shipped()
            return Response({
                'success': True,
                'message': 'Order marked as shipped.',
                'order': OrderDetailSerializer(order).data
            })
        except DjangoValidationError as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        """Cancel order (if cancellable)"""
        order = self.get_object()

        # Verify ownership
        if order.customer != request.user and not request.user.is_staff:
            return Response({
                'success': False,
                'error': 'Not authorized to cancel this order.'
            }, status=status.HTTP_403_FORBIDDEN)

        if not order.can_be_cancelled:
            return Response({
                'success': False,
                'error': f'Cannot cancel order with status: {order.get_status_display()}.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            order.cancel_order()
            return Response({
                'success': True,
                'message': 'Order cancelled successfully.'
            })
        except DjangoValidationError as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def feedback(self, request, pk=None):
        """Add feedback to completed order"""
        order = self.get_object()

        # Verify order is completed
        if not order.is_completed:
            return Response({
                'success': False,
                'error': 'Only completed/cancelled orders can receive feedback.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Verify ownership
        if order.customer != request.user and not request.user.is_staff:
            return Response({
                'success': False,
                'error': 'Not authorized to feedback this order.'
            }, status=status.HTTP_403_FORBIDDEN)

        # Check if feedback already exists
        if hasattr(order, 'feedback') and order.feedback:
            return Response({
                'success': False,
                'error': 'Feedback already exists for this order.'
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = OrderFeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        feedback = serializer.save(order=order)

        return Response({
            'success': True,
            'message': 'Thank you for your feedback!',
            'feedback': OrderFeedbackSerializer(feedback).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], permission_classes=[IsAdminUser])
    def summary(self, request, pk=None):
        """Get order summary (admin)"""
        order = self.get_object()
        
        return Response({
            'success': True,
            'order_number': order.order_number,
            'customer': order.customer_name,
            'email': order.customer_email,
            'phone': order.customer_phone,
            'items_count': order.item_count,
            'subtotal': float(order.subtotal),
            'discount': float(order.discount_amount),
            'tax': float(order.tax_amount),
            'delivery_fee': float(order.delivery_fee),
            'total': float(order.total_amount),
            'status': order.get_status_display(),
            'delivery_type': order.get_delivery_type_display(),
            'address': f"{order.delivery_address}, {order.delivery_city}",
            'created': order.created_at.isoformat(),
            'updated': order.updated_at.isoformat()
        })
