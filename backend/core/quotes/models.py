"""
Quote models for service inquiries and custom project quotations
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
import uuid

User = get_user_model()


class Quote(models.Model):
    """
    Quote request for custom services (design, printing, photography, etc.)
    """
    STATUS_CHOICES = [
        ('submitted', 'Submitted - Awaiting review'),
        ('reviewing', 'Reviewing - Admin is evaluating'),
        ('quoted', 'Quoted - Quote has been sent'),
        ('accepted', 'Accepted - Customer accepted quote'),
        ('rejected', 'Rejected - Customer declined'),
        ('cancelled', 'Cancelled - Quote cancelled'),
    ]

    SERVICE_CHOICES = [
        ('graphic_design', 'Graphic Design'),
        ('logo_design', 'Logo Design'),
        ('printing', 'Printing Services'),
        ('merchandise', 'Merchandise Production'),
        ('photography', 'Photography'),
        ('video', 'Video Production'),
        ('interior_design', 'Interior Design'),
        ('exterior_design', 'Exterior Design'),
        ('other', 'Other'),
    ]

    # Identifiers
    quote_id = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False
    )
    quote_number = models.CharField(
        max_length=20, unique=True, db_index=True,
        help_text='Auto-generated quote reference'
    )

    # Customer Information
    customer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='quotes'
    )
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    company_name = models.CharField(
        max_length=200, blank=True,
        help_text='Company/organization name if applicable'
    )

    # Service Details
    service_type = models.CharField(
        max_length=30, choices=SERVICE_CHOICES,
        help_text='Type of service requested'
    )
    description = models.TextField(
        help_text='Detailed description of the project'
    )
    specifications = models.TextField(
        blank=True,
        help_text='Technical specifications, requirements, preferences'
    )

    # Attachments
    attachment = models.FileField(
        upload_to='quotes/%Y/%m/',
        null=True, blank=True,
        help_text='Design file, reference image, or specification document'
    )

    # Status & Pricing
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='submitted',
        db_index=True
    )
    estimated_cost = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
        validators=[MinValueValidator(0)],
        help_text='Estimated project cost (set by admin)'
    )
    final_quote_amount = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
        validators=[MinValueValidator(0)],
        help_text='Final quoted amount'
    )
    quote_notes = models.TextField(
        blank=True,
        help_text='Admin notes about the quote'
    )

    # Timeline
    required_by = models.DateField(
        null=True, blank=True,
        help_text='When customer needs the project completed'
    )
    expected_completion = models.DateField(
        null=True, blank=True,
        help_text='Expected completion date (set by admin)'
    )

    # Tracking
    priority = models.IntegerField(
        default=0,
        help_text='Higher numbers = higher priority'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    reviewed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='reviewed_quotes',
        help_text='Admin who last reviewed this quote'
    )
    reviewed_at = models.DateTimeField(
        null=True, blank=True,
        help_text='When admin last reviewed this quote'
    )

    class Meta:
        ordering = ['-priority', '-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['quote_number']),
            models.Index(fields=['customer']),
            models.Index(fields=['service_type']),
        ]

    def __str__(self):
        return f'Quote {self.quote_number} - {self.customer_name}'

    def save(self, *args, **kwargs):
        """Auto-generate quote number"""
        if not self.quote_number:
            from django.utils.timezone import now
            count = Quote.objects.count() + 1
            self.quote_number = f'QT-{now().strftime("%Y%m%d")}-{count:04d}'
        super().save(*args, **kwargs)


class QuoteComment(models.Model):
    """
    Comments/communication on a quote between customer and admin
    """
    quote = models.ForeignKey(
        Quote, on_delete=models.CASCADE, related_name='comments'
    )
    author = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='quote_comments'
    )
    is_admin = models.BooleanField(
        default=False,
        help_text='Whether comment was made by admin/staff'
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Quote Comments'

    def __str__(self):
        return f'Comment on {self.quote.quote_number}'