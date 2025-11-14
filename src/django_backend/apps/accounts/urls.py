# apps/accounts/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    UserProfileView,
    ChangePasswordView,
    UserAddressListCreateView,
    UserAddressDetailView,
    UserActivityListView,
    UserActivityExportView,
    UserDashboardView,
    AdminUserListView,
)

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('dashboard/', UserDashboardView.as_view(), name='dashboard'),

    # Addresses
    path('addresses/', UserAddressListCreateView.as_view(), name='address_list'),
    path('addresses/<int:pk>/', UserAddressDetailView.as_view(), name='address_detail'),

    # Activities
    path('activities/', UserActivityListView.as_view(), name='activities'),
    path('activities/export/', UserActivityExportView.as_view(), name='activities_export'),

    # Admin
    path('users/', AdminUserListView.as_view(), name='user_list'),
]
