# apps/accounts/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    UserProfileView,
    ChangePasswordView,
    UserAddressViewSet,
    UserActivityListView,
    UserActivityExportView,
    UserDashboardView,
    AdminUserListView,
)
from .nxtbn_views import (
    UserProfileAPIView,
    UserStatsAPIView,
    UserListAPIView,
    UserDetailAPIView,
    UserRoleUpdateAPIView,
    UserPermissionsAPIView,
)

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile (Original)
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('dashboard/', UserDashboardView.as_view(), name='dashboard'),

    # Addresses
    path('addresses/', UserAddressViewSet.as_view({'get': 'list', 'post': 'create'}), name='address_list'),
    path('addresses/<int:pk>/', UserAddressViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='address_detail'),
    path('addresses/<int:pk>/set_default/', UserAddressViewSet.as_view({'post': 'set_default'}), name='address_set_default'),

    # Activities
    path('activities/', UserActivityListView.as_view(), name='activities'),
    path('activities/export/', UserActivityExportView.as_view(), name='activities_export'),

    # Admin (Original)
    path('users/', AdminUserListView.as_view(), name='user_list'),
    
    # =============================
    # NXTBN-STYLE API ENDPOINTS
    # =============================
    
    # User Profile & Stats (nxtbn-style)
    path('api/profile/', UserProfileAPIView.as_view(), name='api_profile'),
    path('api/stats/', UserStatsAPIView.as_view(), name='api_stats'),
    path('api/permissions/', UserPermissionsAPIView.as_view(), name='api_permissions'),
    
    # User Management (Admin only)
    path('api/users/', UserListAPIView.as_view(), name='api_user_list'),
    path('api/users/<int:id>/', UserDetailAPIView.as_view(), name='api_user_detail'),
    path('api/users/<int:user_id>/role/', UserRoleUpdateAPIView.as_view(), name='api_user_role'),
]
