"""
تنظیمات اپلیکیشن Accounts
"""
from django.apps import AppConfig


class AccountsConfig(AppConfig):
    """تنظیمات اپ مدیریت کاربران"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.accounts'
    verbose_name = 'مدیریت کاربران'
    
    def ready(self):
        """اجرای کدها هنگام آماده شدن اپ"""
        import apps.accounts.signals  # برای فعال‌سازی سیگنال‌ها
