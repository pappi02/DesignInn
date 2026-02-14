"""
Custom exception handlers for API responses
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns consistent error responses.
    """
    # Get the standard exception response
    response = exception_handler(exc, context)

    if response is not None:
        # Add consistent error structure
        custom_response = {
            'success': False,
            'error': str(response.data.get('detail', 'An error occurred')),
            'status_code': response.status_code,
        }
        
        # Add validation errors if present
        if isinstance(response.data, dict) and 'detail' not in response.data:
            custom_response['details'] = response.data
        
        response.data = custom_response
    else:
        # Log unhandled exceptions
        logger.error(f'Unhandled exception: {exc}', exc_info=True)
        response = Response({
            'success': False,
            'error': 'An unexpected error occurred',
            'status_code': 500,
        }, status=500)

    return response
