#!/usr/bin/env python
"""
فایل مدیریت Django
این فایل برای اجرای دستورات Django استفاده می‌شود
مثل: python manage.py runserver, migrate, createsuperuser و...
"""
import os
import sys


def main():
    """اجرای وظایف اداری Django"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django را نمی‌توان وارد کرد. آیا آن را نصب کرده‌اید و "
            "محیط مجازی را فعال کرده‌اید؟"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
