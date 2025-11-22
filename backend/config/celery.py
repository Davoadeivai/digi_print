"""
تنظیمات Celery برای اجرای وظایف async
استفاده: برای ارسال ایمیل، پردازش فایل و... به صورت غیرهمزمان
"""
import os
from celery import Celery
from celery.schedules import crontab

# تنظیم متغیر محیطی Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('digichapograph')

# استفاده از تنظیمات Django با prefix CELERY_
app.config_from_object('django.conf:settings', namespace='CELERY')

# کشف خودکار تسک‌ها در فایل tasks.py هر اپ
app.autodiscover_tasks()

# تنظیمات پیشفرض Celery
app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Tehran',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 دقیقه
    worker_max_tasks_per_child=1000,
)

# وظایف دوره‌ای (Periodic Tasks)
app.conf.beat_schedule = {
    # پاکسازی سفارشات معلق هر روز ساعت 2 صبح
    'cleanup-old-orders': {
        'task': 'apps.orders.tasks.cleanup_old_pending_orders',
        'schedule': crontab(hour=2, minute=0),
    },
    # ارسال گزارش روزانه
    'send-daily-report': {
        'task': 'apps.core.tasks.send_daily_report',
        'schedule': crontab(hour=20, minute=0),
    },
}


@app.task(bind=True)
def debug_task(self):
    """تسک تستی برای دیباگ"""
    print(f'Request: {self.request!r}')
