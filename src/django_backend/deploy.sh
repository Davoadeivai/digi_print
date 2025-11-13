#!/bin/bash

# تنظیمات پیش‌فرض
ENV_FILE=".env"
REQUIREMENTS_FILE="requirements.txt"
PYTHON_EXEC="python3"
PIP_EXEC="pip3"

# بررسی وجود فایل .env
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  فایل $ENV_FILE یافت نشد. لطفا آن را ایجاد کنید."
    exit 1
fi

# نصب وابستگی‌ها
echo "📦 در حال نصب وابستگی‌های پایتون..."
$PIP_EXEC install -r $REQUIREMENTS_FILE

# اجرای مهاجرت‌ها
echo "🔄 در حال اجرای مهاجرت‌های دیتابیس..."
$PYTHON_EXEC manage.py migrate

# جمع‌آوری فایل‌های استاتیک
echo "📁 در حال جمع‌آوری فایل‌های استاتیک..."
$PYTHON_EXEC manage.py collectstatic --noinput

# ایجاد سوپر یوزر در صورت نیاز
read -p "آیا می‌خواهید یک سوپر یوزر ایجاد کنید؟ (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    $PYTHON_EXEC manage.py createsuperuser
fi

echo "✅ استقرار با موفقیت انجام شد!"
echo "برای اجرای سرور از دستور زیر استفاده کنید:"
echo "$PYTHON_EXEC manage.py runserver"
echo "یا برای اجرای با Gunicorn:"
echo "gunicorn config.wsgi:application --bind 0.0.0.0:8000"
