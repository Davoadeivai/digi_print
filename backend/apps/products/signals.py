"""
سیگنال‌های اپ products
"""

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import UploadedFile
from apps.orders.models import Order


@receiver(post_save, sender=Order)
def order_created(sender, instance, created, **kwargs):
    """
    وقتی سفارش جدید ایجاد شد
    """
    if created:
        # می‌توانید ایمیل تأیید برای مشتری ارسال کنید
        try:
            subject = f'سفارش #{instance.order_number} دریافت شد'
            message = f'''
            سفارش شما با موفقیت دریافت شد.
            
            شماره سفارش: {instance.order_number}
            مبلغ کل: {instance.total_amount:,} تومان
            
            در حال بررسی سفارش شما هستیم و از طریق ایمیل اطلاع‌رسانی خواهیم کرد.
            '''
            
            # send_mail(
            #     subject,
            #     message,
            #     settings.DEFAULT_FROM_EMAIL,
            #     [instance.contact_email],
            #     fail_silently=True,
            # )
        except Exception as e:
            print(f"Error sending order confirmation email: {e}")


@receiver(post_save, sender=UploadedFile)
def file_uploaded(sender, instance, created, **kwargs):
    """
    وقتی فایل جدید آپلود شد
    """
    if created:
        # می‌توانید پردازش‌های لازم را روی فایل انجام دهید
        # مثلاً ایجاد thumbnail برای تصاویر
        if instance.file_type in ['jpg', 'jpeg', 'png', 'tiff']:
            try:
                # ایجاد thumbnail در اینجا
                from PIL import Image
                import os
                
                if instance.file:
                    image = Image.open(instance.file.path)
                    image.thumbnail((200, 200), Image.Resampling.LANCZOS)
                    
                    thumbnail_path = instance.file.path.replace('.', '_thumb.')
                    image.save(thumbnail_path)
                    
                    # ذخیره مسیر thumbnail در مدل
                    relative_thumb_path = thumbnail_path.replace(settings.MEDIA_ROOT, '')
                    instance.thumbnail = relative_thumb_path
                    instance.save(update_fields=['thumbnail'])
                    
            except Exception as e:
                print(f"Error creating thumbnail: {e}")


@receiver(pre_save, sender=Order)
def order_pre_save(sender, instance, **kwargs):
    """
    قبل از ذخیره سفارش
    """
    # محاسبه مجدد مبلغ کل اگر تغییر کرده باشد
    if instance.pk:
        old_order = Order.objects.get(pk=instance.pk)
        if old_order.subtotal != instance.subtotal or old_order.delivery_cost != instance.delivery_cost:
            instance.total_amount = instance.subtotal - instance.discount_amount + instance.delivery_cost
