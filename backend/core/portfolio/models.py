"""
Portfolio models for showcasing completed projects and work
"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class PortfolioProject(models.Model):
    """
    Portfolio project representing completed work/case study
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    CATEGORY_CHOICES = [
        ('graphic_design', 'Graphic Design'),
        ('logo', 'Logo Design'),
        ('printing', 'Printing'),
        ('merchandise', 'Merchandise'),
        ('photography', 'Photography'),
        ('interior', 'Interior Design'),
        ('exterior', 'Exterior Design'),
        ('branding', 'Branding'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    category = models.CharField(
        max_length=30, choices=CATEGORY_CHOICES,
        help_text='Project category'
    )
    client_name = models.CharField(
        max_length=200, blank=True,
        help_text='Client name (can be anonymous)'
    )
    featured_image = models.ImageField(upload_to='portfolio/')
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='draft'
    )
    
    # Content
    overview = models.TextField(
        blank=True,
        help_text='Project overview and objectives'
    )
    process = models.TextField(
        blank=True,
        help_text='Our process and approach'
    )
    results = models.TextField(
        blank=True,
        help_text='Results and impact'
    )
    
    # SEO & Visibility
    is_featured = models.BooleanField(default=False)
    tags = models.CharField(
        max_length=500, blank=True,
        help_text='Comma-separated tags'
    )
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.CharField(max_length=300, blank=True)
    
    # Tracking
    author = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='portfolio_projects'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category']),
            models.Index(fields=['status']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return self.title

    def increment_views(self):
        """Increment project views"""
        self.views_count += 1
        self.save(update_fields=['views_count'])


class PortfolioImage(models.Model):
    """
    Images for portfolio project gallery
    """
    project = models.ForeignKey(
        PortfolioProject, on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='portfolio_gallery/')
    caption = models.CharField(
        max_length=300, blank=True,
        help_text='Image caption/description'
    )
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name_plural = 'Portfolio Images'

    def __str__(self):
        return f'Gallery for {self.project.title}'