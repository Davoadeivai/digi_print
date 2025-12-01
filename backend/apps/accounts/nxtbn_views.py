# apps/accounts/nxtbn_views.py
# NXTBN-Style API Views for User Management

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

from .models import UserProfile, UserAddress
from .serializers import (
    UserSerializer,
    UserStatsSerializer,
    UserUpdateSerializer,
    UserAdminSerializer,
    UserAddressSerializer,
)
from .enums import UserRole, PermissionsEnum

User = get_user_model()


class IsAdminOrStoreAdmin(permissions.BasePermission):
    """
    مجوز سفارشی: فقط Admin یا Store Admin
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.is_superuser or 
            request.user.is_store_admin or
            request.user.role == UserRole.ADMIN
        )


class IsOrderProcessorOrAdmin(permissions.BasePermission):
    """
    مجوز سفارشی: Order Processor یا Admin
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.role in [UserRole.ORDER_PROCESSOR, UserRole.ADMIN] or
            request.user.is_superuser
        )


# =============================
# USER PROFILE API
# =============================

class UserProfileAPIView(APIView):
    """
    دریافت و ویرایش پروفایل کاربر جاری (nxtbn-style)
    GET: دریافت اطلاعات کامل کاربر با آمار
    PATCH: ویرایش اطلاعات پروفایل
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """دریافت اطلاعات کامل کاربر"""
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def patch(self, request):
        """ویرایش پروفایل کاربر"""
        serializer = UserUpdateSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            # بازگرداندن اطلاعات کامل
            full_serializer = UserSerializer(request.user)
            return Response({
                'success': True,
                'message': 'پروفایل با موفقیت به‌روزرسانی شد',
                'data': full_serializer.data
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# =============================
# USER STATS API
# =============================

class UserStatsAPIView(APIView):
    """
    دریافت آمار کاربر جاری (nxtbn-style)
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """دریافت آمار کامل کاربر"""
        user = request.user
        profile = UserProfile.objects.filter(user=user).first()
        
        stats_data = {
            'total_orders': user.total_order_count(),
            'pending_orders': user.total_pending_order_count(),
            'cancelled_orders': user.total_cancelled_order_count(),
            'completed_orders': user.total_completed_order_count(),
            'total_spent': profile.total_spent if profile else 0,
            'discount_percentage': profile.discount_percentage if profile else 0,
            'addresses_count': UserAddress.objects.filter(user_profile__user=user).count(),
        }
        
        serializer = UserStatsSerializer(stats_data)
        return Response({
            'success': True,
            'data': serializer.data
        })


# =============================
# USER MANAGEMENT (ADMIN)
# =============================

class UserListAPIView(generics.ListAPIView):
    """
    لیست تمام کاربران (فقط برای Admin) (nxtbn-style)
    """
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminOrStoreAdmin]
    queryset = User.objects.all().order_by('-date_joined')
    
    def get_queryset(self):
        """فیلتر بر اساس نقش"""
        queryset = super().get_queryset()
        role = self.request.query_params.get('role', None)
        if role:
            queryset = queryset.filter(role=role)
        return queryset
    
    def list(self, request, *args, **kwargs):
        """بازگرداندن لیست با فرمت سفارشی"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'count': queryset.count(),
            'data': serializer.data
        })


class UserDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    جزئیات، ویرایش و حذف کاربر (فقط برای Admin) (nxtbn-style)
    """
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminOrStoreAdmin]
    queryset = User.objects.all()
    lookup_field = 'id'
    
    def retrieve(self, request, *args, **kwargs):
        """دریافت جزئیات کاربر"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def update(self, request, *args, **kwargs):
        """ویرایش کاربر"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'کاربر با موفقیت به‌روزرسانی شد',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """حذف کاربر"""
        instance = self.get_object()
        # جلوگیری از حذف خودش
        if instance.id == request.user.id:
            return Response({
                'success': False,
                'message': 'شما نمی‌توانید حساب خود را حذف کنید'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        instance.delete()
        return Response({
            'success': True,
            'message': 'کاربر با موفقیت حذف شد'
        }, status=status.HTTP_204_NO_CONTENT)


# =============================
# USER ROLE MANAGEMENT
# =============================

class UserRoleUpdateAPIView(APIView):
    """
    تغییر نقش کاربر (فقط برای Admin) (nxtbn-style)
    """
    permission_classes = [IsAdminOrStoreAdmin]
    
    def patch(self, request, user_id):
        """تغییر نقش کاربر"""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'کاربر یافت نشد'
            }, status=status.HTTP_404_NOT_FOUND)
        
        new_role = request.data.get('role')
        if not new_role or new_role not in [r.value for r in UserRole]:
            return Response({
                'success': False,
                'message': 'نقش نامعتبر است'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # جلوگیری از تغییر نقش خودش
        if user.id == request.user.id:
            return Response({
                'success': False,
                'message': 'شما نمی‌توانید نقش خود را تغییر دهید'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.role = new_role
        
        # تنظیم فلگ‌های مرتبط
        if new_role == UserRole.ADMIN:
            user.is_store_admin = True
            user.is_staff = True
        elif new_role == UserRole.ORDER_PROCESSOR:
            user.is_store_staff = True
        
        user.save()
        
        serializer = UserAdminSerializer(user)
        return Response({
            'success': True,
            'message': 'نقش کاربر با موفقیت تغییر یافت',
            'data': serializer.data
        })


# =============================
# USER PERMISSIONS CHECK
# =============================

class UserPermissionsAPIView(APIView):
    """
    بررسی دسترسی‌های کاربر (nxtbn-style)
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """دریافت لیست دسترسی‌های کاربر"""
        user = request.user
        from .enums import ROLE_PERMISSIONS
        
        user_permissions = ROLE_PERMISSIONS.get(user.role, [])
        
        return Response({
            'success': True,
            'data': {
                'role': user.role,
                'role_display': user.role_display,
                'is_superuser': user.is_superuser,
                'is_store_admin': user.is_store_admin,
                'is_store_staff': user.is_store_staff,
                'permissions': [perm.value for perm in user_permissions]
            }
        })
