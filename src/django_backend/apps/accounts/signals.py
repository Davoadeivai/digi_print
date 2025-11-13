"""
سیگنال‌های اپلیکیشن Accounts
برای انجام کارهای خودکار هنگام رویدادهای خاص
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    ایجاد خودکار پروفایل برای کاربر جدید
    این سیگنال بعد از ایجاد هر کاربر جدید اجرا می‌شود
    """
    if created:
        UserProfile.objects.get_or_create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    ذخیره خودکار پروفایل کاربر
    هنگام ذخیره کاربر، پروفایل هم ذخیره می‌شود
    """
    if hasattr(instance, 'profile'):
        instance.profile.save()
