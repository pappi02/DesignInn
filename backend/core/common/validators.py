"""
Custom validators for model fields and form data
"""
from django.core.exceptions import ValidationError
import re


def validate_phone_number(value):
    """
    Validate phone number format.
    Accepts formats like: 1234567890, +1234567890, (123) 456-7890
    """
    phone_pattern = r'^\+?1?\d{9,15}$'
    if not re.match(phone_pattern, value.replace('-', '').replace(' ', '').replace('(', '').replace(')', '')):
        raise ValidationError(
            'Invalid phone number format. Please enter a valid phone number.'
        )


def validate_file_size(file):
    """
    Validate that uploaded file is not larger than 10MB
    """
    file_size = file.size
    limit_mb = 10
    if file_size > limit_mb * 1024 * 1024:
        raise ValidationError(f'File size exceeds {limit_mb}MB limit.')


def validate_file_type(file, allowed_types):
    """
    Validate that uploaded file is of allowed type.
    
    Args:
        file: The uploaded file
        allowed_types: List of allowed MIME types (e.g., ['image/jpeg', 'image/png'])
    """
    if file.content_type not in allowed_types:
        raise ValidationError(
            f'File type not allowed. Allowed types: {", ".join(allowed_types)}'
        )
