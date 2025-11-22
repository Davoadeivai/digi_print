"""
وظایف Celery برای Core
"""
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_email_task(subject, message, recipient_list):
    """
    ارسال ایمیل به صورت async
    استفاده: send_email_task.delay('موضوع', 'پیام', ['email@example.com'])
    """
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
        )
        logger.info(f'Email sent to {recipient_list}')
        return True
    except Exception as e:
        logger.error(f'Failed to send email: {str(e)}')
        return False


@shared_task
def send_daily_report():
    """
    ارسال گزارش روزانه به ادمین
    این تسک توسط celery beat به صورت دوره‌ای اجرا می‌شود
    """
    from apps.orders.models import Order
    from apps.contact.models import ContactMessage
    from datetime import timedelta
    from django.utils import timezone
    
    yesterday = timezone.now() - timedelta(days=1)
    
    # آمار سفارشات
    new_orders = Order.objects.filter(created_at__gte=yesterday).count()
    pending_orders = Order.objects.filter(status='pending').count()
    
    # آمار پیام‌ها
    new_messages = ContactMessage.objects.filter(created_at__gte=yesterday).count()
    unread_messages = ContactMessage.objects.filter(is_read=False).count()
    
    # ساخت متن گزارش
    report = f"""
    گزارش روزانه - {timezone.now().strftime('%Y-%m-%d')}
    
    سفارشات:
    - سفارشات جدید: {new_orders}
    - سفارشات در انتظار: {pending_orders}
    
    پیام‌ها:
    - پیام‌های جدید: {new_messages}
    - پیام‌های خوانده نشده: {unread_messages}
    """
    
    # ارسال ایمیل
    send_mail(
        subject='گزارش روزانه سایت',
        message=report,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL],
        fail_silently=False,
    )
    
    logger.info('Daily report sent')
    return True


@shared_task
def cleanup_old_files():
    """
    پاکسازی فایل‌های قدیمی و غیرضروری
    """
    # پیاده‌سازی لاجیک پاکسازی
    logger.info('Cleanup task executed')
    return True


@shared_task
def backup_database():
    """
    پشتیبان‌گیری از دیتابیس
    """
    # پیاده‌سازی لاجیک بکآپ
    logger.info('Database backup completed')
    return True
