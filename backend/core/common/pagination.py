"""
Common pagination classes for API responses
"""
from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """
    Standard pagination class for all list endpoints.
    Allows clients to specify page size via ?page_size=N query parameter.
    """
    page_size = 12
    page_size_query_param = 'page_size'
    page_size_query_description = 'Number of results to return per page.'
    max_page_size = 100
