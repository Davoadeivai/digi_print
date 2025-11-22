"""
تنظیمات اپلیکیشن Core
"""
from django.apps import AppConfig


class CoreConfig(AppConfig):
    """تنظیمات اپ عملکردهای مشترک"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core'
    verbose_name = 'عملکردهای مشترک'
