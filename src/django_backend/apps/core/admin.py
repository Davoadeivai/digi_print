"""
تنظیمات پنل ادمین برای Core
"""
from django.contrib import admin
from .models import Settings


@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    """مدیریت تنظیمات سایت"""
    
    list_display = ['key', 'value_preview', 'is_active', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['key', 'value', 'description']
    list_editable = ['is_active']
    
    fieldsets = (
        ('اطلاعات اصلی', {
            'fields': ('key', 'value', 'description')
        }),
        ('وضعیت', {
            'fields': ('is_active',)
        }),
        ('تاریخ‌ها', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def value_preview(self, obj):
        """نمایش پیش‌نمایش مقدار"""
        return obj.value[:50] + '...' if len(obj.value) > 50 else obj.value
    value_preview.short_description = 'مقدار'
