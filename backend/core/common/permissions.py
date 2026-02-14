"""
Custom permission classes for API endpoints
"""
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allows read access to anyone.
    Write access only to admin users.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class CanViewOwnOrderOrAdmin(permissions.BasePermission):
    """
    Allows users to view only their own orders or admin to view all.
    """
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        return obj.customer_phone == request.GET.get('phone')
