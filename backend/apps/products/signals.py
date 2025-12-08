"""
سیگنال‌های اپ products
"""

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings
from .models import UploadedFile


@receiver(post_save, sender='orders.Order')
def order_created(sender, instance, created, **kwargs):
    """
    وقتی سفارش جدید ایجاد شد
    """
    if created:
        try:
            subject = f'سفارش #{instance.order_number} دریافت شد'
            message = f'''
سفارش شما با موفقیت دریافت شد.

شماره سفارش: {instance.order_number}
مبلغ کل: {instance.total_amount:,} تومان
'''
        except Exception as e:
            print(f"Error sending order confirmation email: {e}")


@receiver(pre_save, sender='orders.Order')
def order_pre_save(sender, instance, **kwargs):
    """
    قبل از ذخیره سفارش
    """
    if instance.pk:
        from apps.orders.models import Order  # ✅ ایمپورت امن

        old_order = Order.objects.get(pk=instance.pk)
        if (
            old_order.subtotal != instance.subtotal
            or old_order.delivery_cost != instance.delivery_cost
        ):
            instance.total_amount = (
                instance.subtotal - instance.discount_amount + instance.delivery_cost
            )


@receiver(post_save, sender=UploadedFile)
def file_uploaded(sender, instance, created, **kwargs):
    """
    وقتی فایل جدید آپلود شد
    """
    if created and instance.file_type in ['jpg', 'jpeg', 'png', 'tiff']:
        try:
            from PIL import Image
            import os

            image = Image.open(instance.file.path)
            image.thumbnail((200, 200), Image.Resampling.LANCZOS)

            thumbnail_path = instance.file.path.replace('.', '_thumb.')
            image.save(thumbnail_path)

            relative_thumb_path = thumbnail_path.replace(settings.MEDIA_ROOT, '')
            instance.thumbnail = relative_thumb_path
            instance.save(update_fields=['thumbnail'])

        except Exception as e:
            print(f"Error creating thumbnail: {e}")
