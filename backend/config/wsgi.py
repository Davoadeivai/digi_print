"""
تنظیمات WSGI برای پروژه Django
استفاده می‌شود برای deploy در production با gunicorn یا uWSGI
"""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
