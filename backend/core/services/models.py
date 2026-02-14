"""
Services models for service offerings and pricing
"""
from django.db import models
from django.core.validators import MinValueValidator


class Service(models.Model):
    """
    Service offering with pricing and features
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('unavailable', 'Unavailable'),
        ('discontinued', 'Discontinued'),
    ]

    SERVICE_TYPE_CHOICES = [
        ('graphic_design', 'Graphic Design'),
        ('logo_design', 'Logo Design'),
        ('branding', 'Branding Package'),
        ('web_design', 'Web Design'),
        ('printing', 'Printing Services'),
        ('merchandise', 'Merchandise Production'),
        ('photography', 'Photography'),
        ('videography', 'Videography'),
        ('interior_design', 'Interior Design'),
        ('exterior_design', 'Exterior Design'),
        ('consulting', 'Consulting'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    service_type = models.CharField(
        max_length=30, choices=SERVICE_TYPE_CHOICES
    )
    description = models.TextField(
        help_text='Service description and overview'
    )
    short_description = models.CharField(
        max_length=300, blank=True,
        help_text='Brief description for listings'
    )
    
    # Pricing
    base_price = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(0.01)],
        help_text='Starting price for this service'
    )
    price_range = models.CharField(
        max_length=100, blank=True,
        help_text='e.g., "From $500 to $5000" - for marketing display'
    )
    
    # Features
    features = models.JSONField(
        default=list, blank=True,
        help_text='List of features included in service'
    )
    delivery_time = models.CharField(
        max_length=100, blank=True,
        help_text='e.g., "5-7 business days"'
    )
    revision_rounds = models.IntegerField(
        default=2,
        validators=[MinValueValidator(0)],
        help_text='Number of revision rounds included'
    )
    
    # Marketing
    icon = models.ImageField(
        upload_to='services/',
        null=True, blank=True,
        help_text='Service icon/image'
    )
    is_featured = models.BooleanField(default=False)
    display_order = models.IntegerField(
        default=0,
        help_text='Order in listings'
    )
    
    # SEO
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.CharField(max_length=300, blank=True)
    
    # Status
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='active'
    )
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['service_type']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return self.name

    def get_all_features(self):
        """Get features as a list"""
        if isinstance(self.features, str):
            return [f.strip() for f in self.features.split(',')]
        return self.features or []