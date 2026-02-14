"""
User signals for automatic actions on model events
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """
    Create authentication token when new user is created
    This allows users to authenticate immediately after registration
    """
    if created:
        token, _ = Token.objects.get_or_create(user=instance)


@receiver(post_save, sender=User)
def handle_user_created(sender, instance=None, created=False, **kwargs):
    """
    Handle actions when a new user is created
    In a production environment, you would send welcome email here
    """
    if created:
        # TODO: Send welcome email with onboarding information
        # TODO: Create user profile or preferences
        # TODO: Add user to welcome sequence
        pass


@receiver(post_delete, sender=User)
def cleanup_user_data(sender, instance=None, **kwargs):
    """
    Cleanup when user is deleted
    """
    try:
        # Delete associated token
        Token.objects.filter(user=instance).delete()
        # TODO: Clean up user-related data (orders, quotes, etc.)
    except Exception as e:
        print(f"Error during user cleanup: {str(e)}")
