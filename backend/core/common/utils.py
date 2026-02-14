"""
Utility functions and helpers
"""
import uuid
from django.db import models


def generate_order_number():
    """
    Generate a unique order number.
    Format: ORD-XXXXXXXXXXXXXXXX (20 characters)
    """
    return 'ORD-' + str(uuid.uuid4()).replace('-', '').upper()[:16]


def generate_quote_number():
    """
    Generate a unique quote number.
    Format: QT-XXXXXXXXXXXXXXXX (19 characters)
    """
    return 'QT-' + str(uuid.uuid4()).replace('-', '').upper()[:16]


class TimestampedModel(models.Model):
    """
    Abstract base model that provides self-updating
    'created_at' and 'updated_at' fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
