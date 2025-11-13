# 🚀 Django Backend - چاپ و گرافیک دیجیتال

بک‌اند Django برای سایت چاپ و گرافیک دیجیتال با REST API کامل

## 📋 فهرست مطالب

- [ویژگی‌ها](#ویژگیها)
- [پیش‌نیازها](#پیشنیازها)
- [نصب و راه‌اندازی](#نصب-و-راهاندازی)
- [ساختار پروژه](#ساختار-پروژه)
- [API Endpoints](#api-endpoints)
- [استفاده](#استفاده)
- [تست‌ها](#تستها)
- [Deploy](#deploy)

## ✨ ویژگی‌ها

### 🔐 احراز هویت و مدیریت کاربران
- سیستم احراز هویت با JWT
- ثبت‌نام و ورود کاربران
- مدیریت پروفایل
- سیستم نقش‌ها و دسترسی‌ها

### 🛠️ مدیریت خدمات
- دسته‌بندی خدمات
- خدمات چاپ (افست، دیجیتال، UV و...)
- خدمات طراحی گرافیک
- گالری تصاویر برای هر خدمت
- سیستم قیمت‌گذاری

### 🎨 مدیریت نمونه کارها
- دسته‌بندی پروژه‌ها
- نمایش نمونه کارها
- گالری تصاویر
- تگ‌گذاری پروژه‌ها

### 📦 مدیریت سفارشات
- فرم سفارش آنلاین
- آپلود فایل‌های طراحی
- پیگیری وضعیت سفارش
- مدیریت آیتم‌های سفارش
- سیستم قیمت‌گذاری خودکار

### 📧 فرم تماس
- دریافت پیام‌ها
- سیستم دسته‌بندی موضوعات
- ردیابی وضعیت پاسخ

### 🎯 ویژگی‌های اضافی
- پنل مدیریت فارسی
- مستندسازی خودکار API (Swagger)
- فیلترینگ و جستجو
- Pagination
- Rate Limiting
- File Upload Management
- Email Notifications
- Celery Tasks برای عملیات async

## 🔧 پیش‌نیازها

- Python 3.10 یا بالاتر
- PostgreSQL 13+ (یا MySQL/SQLite برای توسعه)
- Redis (اختیاری - برای Celery و Caching)
- Git

## 🚀 نصب و راه‌اندازی

### روش 1: استفاده از اسکریپت خودکار (پیشنهادی)

#### Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

#### Windows:
```bash
setup.bat
```

### روش 2: نصب دستی

#### 1. کلون کردن پروژه
```bash
git clone https://github.com/yourusername/digichapograph-backend.git
cd digichapograph-backend
```

#### 2. ایجاد محیط مجازی
```bash
# Linux/Mac
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

#### 3. نصب پکیج‌ها
```bash
pip install -r requirements.txt
```

#### 4. تنظیم محیط
```bash
# کپی فایل .env
cp .env.example .env

# ویرایش فایل .env و پر کردن اطلاعات دیتابیس
nano .env  # یا notepad .env در Windows
```

#### 5. مهاجرت دیتابیس
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 6. ایجاد سوپریوزر
```bash
python manage.py createsuperuser
```

#### 7. جمع‌آوری فایل‌های استاتیک
```bash
python manage.py collectstatic
```

#### 8. اجرای سرور
```bash
python manage.py runserver
```

سرور روی `http://localhost:8000` اجرا می‌شود.

## 📁 ساختار پروژه

```
django_backend/
├── manage.py                    # فایل مدیریت Django
├── requirements.txt             # پکیج‌های Python
├── .env.example                # نمونه متغیرهای محیطی
├── setup.sh / setup.bat        # اسکریپت‌های راه‌اندازی
│
├── config/                      # تنظیمات پروژه
│   ├── settings.py             # تنظیمات اصلی
│   ├── urls.py                 # مسیریابی اصلی
│   ├── wsgi.py                 # تنظیمات WSGI
│   ├── asgi.py                 # تنظیمات ASGI
│   └── celery.py               # تنظیمات Celery
│
├── apps/                        # اپلیکیشن‌ها
│   ├── accounts/               # مدیریت کاربران
│   ├── services/               # خدمات
│   ├── portfolio/              # نمونه کارها
│   ├── orders/                 # سفارشات
│   ├── contact/                # تماس با ما
│   └── core/                   # عملکردهای مشترک
│
├── media/                       # فایل‌های آپلود شده
├── static/                      # فایل‌های استاتیک
└── staticfiles/                 # فایل‌های جمع‌آوری شده
```

## 🌐 API Endpoints

### احراز هویت (`/api/v1/accounts/`)
- `POST /register/` - ثبت‌نام کاربر جدید
- `POST /login/` - ورود و دریافت JWT token
- `POST /token/refresh/` - تمدید token
- `GET /profile/` - مشاهده پروفایل (نیاز به احراز هویت)
- `PUT /profile/` - ویرایش پروفایل
- `POST /change-password/` - تغییر رمز عبور

### خدمات (`/api/v1/services/`)
- `GET /categories/` - لیست دسته‌بندی‌ها
- `GET /` - لیست خدمات (با فیلتر و جستجو)
- `GET /{slug}/` - جزئیات یک خدمت

### نمونه کارها (`/api/v1/portfolio/`)
- `GET /categories/` - لیست دسته‌بندی‌ها
- `GET /` - لیست نمونه کارها
- `GET /{slug}/` - جزئیات یک نمونه کار

### سفارشات (`/api/v1/orders/`)
- `POST /create/` - ثبت سفارش جدید
- `GET /my-orders/` - لیست سفارشات کاربر (نیاز به احراز هویت)
- `GET /{order_number}/` - جزئیات سفارش
- `POST /{order_number}/upload/` - آپلود فایل برای سفارش

### تماس (`/api/v1/contact/`)
- `POST /send/` - ارسال پیام تماس

### مستندات
- `GET /api/docs/` - Swagger UI
- `GET /api/redoc/` - ReDoc

## 💻 استفاده

### مثال: ثبت‌نام کاربر

```python
import requests

url = "http://localhost:8000/api/v1/accounts/register/"
data = {
    "email": "user@example.com",
    "full_name": "نام کاربر",
    "password": "securepass123",
    "password_confirm": "securepass123"
}

response = requests.post(url, json=data)
print(response.json())
```

### مثال: ثبت سفارش

```python
url = "http://localhost:8000/api/v1/orders/create/"
data = {
    "customer_name": "علی احمدی",
    "customer_email": "ali@example.com",
    "customer_phone": "09123456789",
    "items": [
        {
            "service": 1,
            "service_title": "چاپ کارت ویزیت",
            "quantity": 1000,
            "unit_price": 500000,
            "specifications": {
                "size": "9x5 cm",
                "paper": "سلفون براق"
            }
        }
    ]
}

response = requests.post(url, json=data)
print(response.json())
```

## 🧪 تست‌ها

```bash
# اجرای تمام تست‌ها
python manage.py test

# اجرای تست‌های یک اپ خاص
python manage.py test apps.accounts

# اجرای تست‌ها با pytest
pytest

# بررسی coverage
coverage run -m pytest
coverage report
```

## 📊 مدیریت

### پنل ادمین
آدرس: `http://localhost:8000/admin/`

از سوپریوزری که ایجاد کردید وارد شوید.

### دستورات مفید

```bash
# ایجاد migration جدید
python manage.py makemigrations

# اعمال migration ها
python manage.py migrate

# ایجاد سوپریوزر
python manage.py createsuperuser

# اجرای shell Django
python manage.py shell

# پاکسازی جدول‌ها
python manage.py flush

# بکآپ دیتابیس
python manage.py dumpdata > backup.json

# بازگردانی دیتابیس
python manage.py loaddata backup.json
```

### Celery (اختیاری)

```bash
# اجرای Celery Worker
celery -A config worker -l info

# اجرای Celery Beat (برای وظایف دوره‌ای)
celery -A config beat -l info

# اجرای همزمان Worker و Beat
celery -A config worker -B -l info
```

## 🚢 Deploy

### با Gunicorn

```bash
# نصب Gunicorn
pip install gunicorn

# اجرا
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Docker (قریب الوقوع)

```bash
docker-compose up -d
```

### متغیرهای محیطی Production

در فایل `.env` این موارد را تغییر دهید:

```env
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
SECRET_KEY=your-very-secure-and-long-secret-key
DB_ENGINE=django.db.backends.postgresql
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## 🔒 امنیت

- همیشه `SECRET_KEY` را تغییر دهید
- در production `DEBUG=False` قرار دهید
- از HTTPS استفاده کنید
- CORS را به درستی تنظیم کنید
- از رمزهای قوی برای دیتابیس استفاده کنید
- فایل `.env` را در git قرار ندهید

## 🤝 مشارکت

1. Fork کنید
2. یک branch جدید بسازید (`git checkout -b feature/AmazingFeature`)
3. تغییرات را commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. Push کنید (`git push origin feature/AmazingFeature`)
5. یک Pull Request باز کنید

## 📝 لایسنس

این پروژه تحت لایسنس MIT است.

## 📞 پشتیبانی

- ایمیل: info@digichapograph.com
- تلگرام: @digichapograph

## 🙏 تشکر

از تمام کسانی که به این پروژه کمک کرده‌اند، متشکریم!
