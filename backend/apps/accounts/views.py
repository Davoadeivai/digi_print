# apps/accounts/views.py

import csv

from django.http import HttpResponse
from django.utils import timezone

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, UserProfile, UserAddress, UserActivity
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    UserAddressSerializer,
    UserActivitySerializer,
    AdminUserSerializer,
)

# -----------------------------
# User Registration
# -----------------------------
class UserRegistrationView(APIView):
    """
    این ویو برای ثبت‌نام کاربران جدید استفاده می‌شود.
    با درخواست GET فیلدهای مورد نیاز و با درخواست POST اطلاعات کاربر را ثبت می‌کند.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def get_serializer_context(self):
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self
        }
    
    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        return self.serializer_class(*args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        """
        درخواست GET: نمایش فیلدهای مورد نیاز برای ثبت‌نام
        """
        serializer = self.get_serializer()
        return Response({
            'success': True,
            'message': 'لطفا اطلاعات خواسته شده را وارد کنید',
            'fields': [
                {
                    'name': field_name,
                    'type': 'email' if field_name == 'email' else 'password' if 'password' in field_name else 'text',
                    'required': field.required,
                    'label': field.label or field_name.replace('_', ' ').title(),
                    'help_text': str(field.help_text) if field.help_text else '',
                    'max_length': getattr(field, 'max_length', None),
                    'min_length': getattr(field, 'min_length', None),
                }
                for field_name, field in serializer.fields.items()
                if field_name not in ['id', 'created_at', 'updated_at']
            ]
        })
    
    def post(self, request, *args, **kwargs):
        """
        درخواست POST: ثبت اطلاعات کاربر جدید
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    'success': True,
                    'message': 'ثبت‌نام با موفقیت انجام شد',
                    'user': UserProfileSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'success': False,
                    'message': 'خطا در ثبت‌نام کاربر',
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # در صورت وجود خطای اعتبارسنجی
        return Response({
            'success': False,
            'message': 'لطفا خطاهای زیر را برطرف کنید',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

# -----------------------------
# User Login
# -----------------------------
class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

# -----------------------------
# User Logout
# -----------------------------
class UserLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

# -----------------------------
# User Profile
# -----------------------------
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

# -----------------------------
# Change Password
# -----------------------------
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = CustomUser
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if not self.object.check_password(serializer.validated_data['old_password']):
            return Response({'old_password': 'رمز عبور قدیمی اشتباه است.'}, status=status.HTTP_400_BAD_REQUEST)
        self.object.set_password(serializer.validated_data['new_password'])
        self.object.save()
        return Response({'detail': 'رمز عبور با موفقیت تغییر یافت.'})

# -----------------------------
# User Addresses
# -----------------------------
class UserAddressListCreateView(generics.ListCreateAPIView):
    serializer_class = UserAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
            return UserAddress.objects.filter(user_profile=user_profile)
        except UserProfile.DoesNotExist:
            return UserAddress.objects.none()

    def perform_create(self, serializer):
        user_profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        serializer.save(user_profile=user_profile)

class UserAddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
            return UserAddress.objects.filter(user_profile=user_profile)
        except UserProfile.DoesNotExist:
            return UserAddress.objects.none()

# -----------------------------
# User Activities
# -----------------------------
class UserActivityListView(generics.ListAPIView):
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user)


class UserActivityExportView(APIView):
    """خروجی گرفتن از تمام فعالیت‌های کاربران به صورت CSV (فقط برای ادمین)."""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        queryset = UserActivity.objects.select_related('user').order_by('-created_at')

        timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
        filename = f'user_activities_{timestamp}.csv'

        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        writer = csv.writer(response)
        writer.writerow(['user_email', 'activity_type', 'description', 'ip_address', 'user_agent', 'created_at'])
        for activity in queryset:
            writer.writerow([
                activity.user.email,
                activity.activity_type,
                activity.description,
                activity.ip_address,
                activity.user_agent,
                timezone.localtime(activity.created_at).strftime('%Y-%m-%d %H:%M:%S'),
            ])

        return response

# -----------------------------
# User Dashboard (مثال)
# -----------------------------
class UserDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'email': request.user.email,
            'full_name': request.user.full_name,
            'phone': request.user.phone,
        })

# -----------------------------
# Admin User List
# -----------------------------
class AdminUserListView(generics.ListAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = CustomUser.objects.all()
