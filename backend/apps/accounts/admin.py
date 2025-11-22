from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html

from .models import CustomUser, UserProfile, UserAddress, UserActivity


class UserAddressInline(admin.TabularInline):
    model = UserAddress
    extra = 0
    fields = ['title', 'city', 'phone', 'is_default']


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    list_display = [
        'email',
        'full_name',
        'role_badge',
        'phone',
        'email_verified_badge',
        'is_active_badge',
        'date_joined_display',
        'last_login_display',
    ]

    search_fields = ['email', 'first_name', 'last_name', 'phone']
    ordering = ['-date_joined']

    def role_badge(self, obj):
        colors = {'customer': '#10b981', 'staff': '#3b82f6', 'admin': '#ef4444'}
        color = colors.get(obj.role, '#6b7280')
        return format_html('<span style="background-color:{}; color:white; padding:3px 10px; border-radius:3px;">{}</span>', color, obj.get_role_display())
    role_badge.short_description = _('نقش')

    def email_verified_badge(self, obj):
        return format_html('<span style="color:{};">{}</span>', '#10b981' if obj.email_verified else '#ef4444', '✓' if obj.email_verified else '✗')
    email_verified_badge.short_description = _('تایید ایمیل')

    def is_active_badge(self, obj):
        return format_html('<span style="color:{};">●</span>', '#10b981' if obj.is_active else '#ef4444')
    is_active_badge.short_description = _('فعال/غیرفعال')

    def date_joined_display(self, obj):
        return obj.date_joined.strftime('%Y/%m/%d') if obj.date_joined else '-'
    date_joined_display.short_description = _('تاریخ عضویت')

    def last_login_display(self, obj):
        return obj.last_login.strftime('%Y/%m/%d %H:%M') if obj.last_login else '-'
    last_login_display.short_description = _('آخرین ورود')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'job_title', 'company_name', 'total_orders', 'total_spent_display']
    inlines = [UserAddressInline]

    def company_name(self, obj):
        return getattr(obj.user, 'company', '-') or '-'
    company_name.short_description = _('شرکت')

    def total_spent_display(self, obj):
        return f"{obj.total_spent:,.0f} تومان"
    total_spent_display.short_description = _('مجموع خرید')


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ['user_profile', 'title', 'city', 'phone', 'is_default']
    search_fields = ['user_profile__user__email', 'title', 'city']


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'ip_address', 'created_at']
    readonly_fields = ['user', 'activity_type', 'description', 'ip_address', 'user_agent', 'created_at']
    search_fields = ['user__email', 'description']
