from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from .managers import CustomUserManager
from .enums import UserRole, PermissionsEnum


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    مدل کاربر سفارشی با ایمیل به‌جای username
    مبتنی بر nxtbn با قابلیت‌های پیشرفته
    """
    email = models.EmailField(_('ایمیل'), unique=True)
    first_name = models.CharField(_('نام'), max_length=150, blank=True)
    last_name = models.CharField(_('نام خانوادگی'), max_length=150, blank=True)
    phone = models.CharField(_('شماره تلفن'), max_length=20, blank=True)
    company = models.CharField(_('شرکت'), max_length=200, blank=True)
    
    # نقش کاربر - استفاده از enum
    role = models.CharField(
        _('نقش'), 
        max_length=50,
        choices=UserRole.choices,
        default=UserRole.CUSTOMER
    )
    
    # فیلدهای دسترسی (از nxtbn)
    is_store_admin = models.BooleanField(_('مدیر فروشگاه'), default=False)
    is_store_staff = models.BooleanField(_('کارمند فروشگاه'), default=False)
    
    # فیلدهای استاندارد Django
    is_staff = models.BooleanField(_('کارمند سایت'), default=False)
    is_active = models.BooleanField(_('فعال'), default=True)
    email_verified = models.BooleanField(_('ایمیل تایید شده'), default=False)
    
    # آواتار (از nxtbn)
    avatar = models.ImageField(_('آواتار'), upload_to='avatars/', null=True, blank=True)
    
    # تاریخ‌ها
    date_joined = models.DateTimeField(_('تاریخ عضویت'), auto_now_add=True)
    updated_at = models.DateTimeField(_('به‌روزرسانی'), auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('کاربر')
        verbose_name_plural = _('کاربران')
        permissions = [
            (PermissionsEnum.CAN_READ_CUSTOMER.value, 'می‌تواند مشتریان را مشاهده کند'),
            (PermissionsEnum.CAN_UPDATE_CUSTOMER.value, 'می‌تواند مشتریان را ویرایش کند'),
            (PermissionsEnum.CAN_DELETE_CUSTOMER.value, 'می‌تواند مشتریان را حذف کند'),
        ]

    def __str__(self):
        parts = [self.get_full_name(), self.email]
        return " - ".join(part for part in parts if part)

    def get_full_name(self):
        """بازگرداندن نام کامل کاربر"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.email
    
    @property
    def full_name(self):
        return self.get_full_name()
        
    @full_name.setter
    def full_name(self, value):
        names = value.split(' ', 1)
        self.first_name = names[0]
        self.last_name = names[1] if len(names) > 1 else ''
    
    @property
    def role_display(self):
        """نمایش فارسی نقش کاربر"""
        return self.get_role_display()
    
    def total_order_count(self):
        """تعداد کل سفارشات کاربر"""
        if hasattr(self, 'orders'):
            return self.orders.count()
        return 0
    
    def total_pending_order_count(self):
        """تعداد سفارشات در انتظار"""
        if hasattr(self, 'orders'):
            return self.orders.filter(status='pending').count()
        return 0
    
    def total_cancelled_order_count(self):
        """تعداد سفارشات لغو شده"""
        if hasattr(self, 'orders'):
            return self.orders.filter(status='cancelled').count()
        return 0
    
    def total_completed_order_count(self):
        """تعداد سفارشات تکمیل شده"""
        if hasattr(self, 'orders'):
            return self.orders.filter(status='completed').count()
        return 0
    
    def has_role(self, role):
        """بررسی نقش کاربر"""
        return self.role == role
    
    def has_permission_for_role(self, permission):
        """بررسی دسترسی بر اساس نقش"""
        from .enums import ROLE_PERMISSIONS
        if self.is_superuser:
            return True
        return permission in ROLE_PERMISSIONS.get(self.role, [])

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(_('بیوگرافی'), blank=True)
    avatar = models.ImageField(_('آواتار'), upload_to='avatars/', null=True, blank=True)
    job_title = models.CharField(_('سمت شغلی'), max_length=150, blank=True)
    department = models.CharField(_('دپارتمان'), max_length=150, blank=True)
    linkedin = models.URLField(_('لینکدین'), blank=True)
    instagram = models.URLField(_('اینستاگرام'), blank=True)
    telegram = models.URLField(_('تلگرام'), blank=True)
    discount_percentage = models.PositiveIntegerField(_('درصد تخفیف'), default=0)
    total_orders = models.PositiveIntegerField(_('تعداد سفارشات'), default=0)
    total_spent = models.PositiveIntegerField(_('مجموع خرید'), default=0)
    notes = models.TextField(_('یادداشت'), blank=True)
    created_at = models.DateTimeField(_('تاریخ ایجاد'), auto_now_add=True)
    updated_at = models.DateTimeField(_('آخرین به‌روزرسانی'), auto_now=True)

    def __str__(self):
        return f"پروفایل {self.user.email}"


class UserAddress(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='addresses')
    title = models.CharField(_('عنوان'), max_length=150)
    full_name = models.CharField(_('نام و نام خانوادگی'), max_length=150)
    phone = models.CharField(_('شماره تلفن'), max_length=20)
    province = models.CharField(_('استان'), max_length=100, blank=True)
    city = models.CharField(_('شهر'), max_length=100, blank=True)
    address = models.TextField(_('آدرس'), blank=True)
    postal_code = models.CharField(_('کدپستی'), max_length=20, blank=True)
    is_default = models.BooleanField(_('پیش‌فرض'), default=False)
    created_at = models.DateTimeField(_('تاریخ ایجاد'), auto_now_add=True)
    updated_at = models.DateTimeField(_('آخرین به‌روزرسانی'), auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.user_profile.user.email}"


class UserActivity(models.Model):
    ACTIVITY_TYPES = [
        ('login', 'ورود'),
        ('logout', 'خروج'),
        ('password_change', 'تغییر رمز عبور'),
        ('profile_update', 'ویرایش پروفایل'),
        ('order_create', 'سفارش جدید'),
        ('order_cancel', 'لغو سفارش'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(_('نوع فعالیت'), max_length=50, choices=ACTIVITY_TYPES)
    description = models.TextField(_('توضیحات'), blank=True)
    ip_address = models.GenericIPAddressField(_('آی‌پی'), blank=True, null=True)
    user_agent = models.TextField(_('User Agent'), blank=True)
    created_at = models.DateTimeField(_('تاریخ ایجاد'), auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.activity_type}"
