"""
User models for customer and staff information
"""
from django.db import models
from django.contrib.auth.models import AbstractUser
from common.utils import TimestampedModel
from common.validators import validate_phone_number


class User(TimestampedModel, AbstractUser):
    """
    Extended User model with additional fields for DesignInn.
    Inherits from AbstractUser and adds custom fields for orders, quotes, and preferences.
    """
    phone = models.CharField(
        max_length=20,
        unique=True,
        validators=[validate_phone_number],
        help_text="Customer or staff phone number"
    )
    company_name = models.CharField(
        max_length=255,
        blank=True,
        help_text="Company or organization name"
    )
    address = models.TextField(
        blank=True,
        help_text="Customer address"
    )
    city = models.CharField(
        max_length=100,
        blank=True,
        help_text="City of residence"
    )
    avatar = models.ImageField(
        upload_to='avatars/%Y/%m/',
        blank=True,
        null=True,
        help_text="User profile picture"
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Email verification status"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone']),
            models.Index(fields=['id']),
        ]

    def __str__(self):
        full_name = self.get_full_name()
        return f"{full_name or self.username} ({self.phone or self.email})"

    def get_full_name(self):
        """Return the user's full name."""
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.username

        """Check if user is a customer"""
        return self.is_active and not self.is_staff

    @property
    def is_admin_user(self):
        """Check if user is admin"""
        return self.is_staff and self.is_superuser
