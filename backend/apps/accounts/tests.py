# apps/accounts/tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, UserProfile, UserAddress, UserActivity

class AccountsAPITestCase(APITestCase):

    def setUp(self):
        # ایجاد یک کاربر عادی
        self.user = CustomUser.objects.create_user(
            email="user@example.com",
            full_name="Test User",
            password="TestPass123!",
        )
        self.user_profile = self.user.profile

        # ایجاد یک کاربر ادمین
        self.admin = CustomUser.objects.create_superuser(
            email="admin@example.com",
            full_name="Admin User",
            password="AdminPass123!"
        )

    # -----------------------------
    # Registration
    # -----------------------------
    def test_user_registration(self):
        url = reverse('accounts:register')
        data = {
            "email": "newuser@example.com",
            "full_name": "New User",
            "phone": "123456789",
            "company": "Test Company",
            "password": "NewPass123!",
            "password_confirm": "NewPass123!"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CustomUser.objects.filter(email="newuser@example.com").exists())

    # -----------------------------
    # Login
    # -----------------------------
    def test_user_login(self):
        url = reverse('accounts:login')
        data = {"email": self.user.email, "password": "TestPass123!"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.access_token = response.data['access']
        self.refresh_token = response.data['refresh']

    # -----------------------------
    # Profile
    # -----------------------------
    def test_user_profile_retrieve_update(self):
        self.test_user_login()  # لاگین
        url = reverse('accounts:profile')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        # Retrieve
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.user.email, response.data['user'])  # user is StringRelatedField

        # Update
        data = {"bio": "Updated bio"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['bio'], "Updated bio")

    # -----------------------------
    # Change Password
    # -----------------------------
    def test_change_password(self):
        self.test_user_login()
        url = reverse('accounts:change_password')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {
            "old_password": "TestPass123!",
            "new_password": "NewPass123!",
            "new_password_confirm": "NewPass123!"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewPass123!"))

    # -----------------------------
    # User Addresses
    # -----------------------------
    def test_user_address_crud(self):
        self.test_user_login()
        url = reverse('accounts:address_list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # Create
        data = {
            "title": "Home",
            "full_name": "Test User",
            "phone": "09123456789",
            "province": "Tehran",
            "city": "TestCity",
            "address": "123 Test St",
            "postal_code": "12345"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        address_id = response.data['id']

        # Retrieve / Update / Delete
        detail_url = reverse('accounts:address_detail', kwargs={'pk': address_id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(detail_url, {"city": "NewCity"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['city'], "NewCity")

        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # -----------------------------
    # User Activities
    # -----------------------------
    def test_user_activities(self):
        self.test_user_login()
        UserActivity.objects.create(user=self.user, activity_type="login", description="Test Login")
        url = reverse('accounts:activities')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # بررسی می‌کنیم که حداقل یک فعالیت وجود دارد (سیگنال‌های لاگین فعالیت‌های اضافی ایجاد می‌کنند)
        self.assertTrue(len(response.data) >= 1)

    # -----------------------------
    # Dashboard
    # -----------------------------
    def test_user_dashboard(self):
        self.test_user_login()
        url = reverse('accounts:dashboard')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    # -----------------------------
    # Admin User List
    # -----------------------------
    def test_admin_user_list(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('accounts:user_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 2)  # شامل user و admin
