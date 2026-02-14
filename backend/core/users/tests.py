"""
Test cases for Users app models, serializers, and views
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token

User = get_user_model()


class UserModelTest(TestCase):
    """Test User model"""

    def setUp(self):
        """Set up test user"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            phone='+1234567890',
            password='testpass123'
        )

    def test_user_creation(self):
        """Test user creation"""
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.phone, '+1234567890')

    def test_user_string_representation(self):
        """Test user string representation"""
        expected = f"{self.user.username} ({self.user.email})"
        self.assertEqual(str(self.user), expected)

    def test_user_get_full_name(self):
        """Test get_full_name method"""
        self.user.first_name = 'John'
        self.user.last_name = 'Doe'
        self.user.save()
        self.assertEqual(self.user.get_full_name(), 'John Doe')

    def test_superuser_creation(self):
        """Test superuser creation"""
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    def test_user_timestamps(self):
        """Test user created_at and updated_at fields"""
        self.assertIsNotNone(self.user.created_at)
        self.assertIsNotNone(self.user.updated_at)
        self.assertEqual(self.user.created_at, self.user.updated_at)

    def test_user_avatar_optional(self):
        """Test that avatar is optional"""
        user_no_avatar = User.objects.create_user(
            username='noavatar',
            email='noavatar@example.com',
            password='testpass123'
        )
        self.assertEqual(user_no_avatar.avatar, '')

    def test_unique_phone(self):
        """Test that phone must be unique"""
        with self.assertRaises(Exception):
            User.objects.create_user(
                username='testuser2',
                email='test2@example.com',
                phone='+1234567890',  # Same phone
                password='testpass123'
            )

    def test_unique_email(self):
        """Test that email must be unique"""
        self.user.email = 'test@example.com'
        with self.assertRaises(Exception):
            User.objects.create_user(
                username='testuser2',
                email='test@example.com',  # Same email
                password='testpass123'
            )


class UserRegistrationAPITest(APITestCase):
    """Test user registration API endpoint"""

    def setUp(self):
        """Set up test client"""
        self.client = APIClient()
        self.register_url = '/api/v1/users/register/'

    def test_user_registration_success(self):
        """Test successful user registration"""
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'phone': '+1987654321',
            'password': 'securepwd123',
            'password_confirm': 'securepwd123',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('token', response.data)
        self.assertEqual(
            User.objects.filter(username='newuser').count(), 1
        )

    def test_registration_password_mismatch(self):
        """Test registration with mismatched passwords"""
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'phone': '+1987654321',
            'password': 'securepwd123',
            'password_confirm': 'differentpwd123',
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_duplicate_email(self):
        """Test registration with existing email"""
        User.objects.create_user(
            username='existing',
            email='test@example.com',
            password='testpass123'
        )
        data = {
            'username': 'newuser',
            'email': 'test@example.com',
            'phone': '+1987654321',
            'password': 'securepwd123',
            'password_confirm': 'securepwd123',
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_short_password(self):
        """Test registration with short password"""
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'phone': '+1987654321',
            'password': 'short',
            'password_confirm': 'short',
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserAuthenticationAPITest(APITestCase):
    """Test user authentication and token endpoints"""

    def setUp(self):
        """Set up test user and client"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            phone='+1234567890',
            password='testpass123'
        )
        self.token = Token.objects.get(user=self.user)

    def test_token_creation_on_user_create(self):
        """Test that token is created when user is created"""
        new_user = User.objects.create_user(
            username='newuser',
            email='new@example.com',
            password='newpass123'
        )
        self.assertTrue(Token.objects.filter(user=new_user).exists())

    def test_verify_token_valid(self):
        """Test token verification with valid token"""
        url = '/api/v1/users/verify_token/'
        data = {'token': self.token.key}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['valid'])

    def test_verify_token_invalid(self):
        """Test token verification with invalid token"""
        url = '/api/v1/users/verify_token/'
        data = {'token': 'invalid_token_key'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.data['valid'])

    def test_profile_view_authenticated(self):
        """Test getting user profile when authenticated"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.get('/api/v1/users/me/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(
            response.data['user']['email'], 'test@example.com'
        )

    def test_profile_view_unauthenticated(self):
        """Test getting user profile without authentication"""
        response = self.client.get('/api/v1/users/me/', format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password_success(self):
        """Test successful password change"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        data = {
            'old_password': 'testpass123',
            'new_password': 'newpass456',
            'new_password_confirm': 'newpass456'
        }
        response = self.client.post(
            '/api/v1/users/change_password/', data, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_change_password_wrong_old(self):
        """Test password change with wrong old password"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        data = {
            'old_password': 'wrongpass',
            'new_password': 'newpass456',
            'new_password_confirm': 'newpass456'
        }
        response = self.client.post(
            '/api/v1/users/change_password/', data, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_logout(self):
        """Test user logout"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post('/api/v1/users/logout/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        # Token should be deleted
        self.assertFalse(Token.objects.filter(user=self.user).exists())
