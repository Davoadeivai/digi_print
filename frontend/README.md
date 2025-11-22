# 🎨 سیستم مدیریت چاپ و گرافیک دیجیتال

[![Django](https://img.shields.io/badge/Django-4.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

سیستم جامع مدیریت خدمات چاپ و گرافیک دیجیتال با معماری مدرن

## 📖 مستندات کامل

برای مشاهده مستندات کامل پروژه به فایل [COMPLETE_PROJECT_SUMMARY.md](COMPLETE_PROJECT_SUMMARY.md) مراجعه کنید.

## 🚀 شروع سریع

1. **پیش‌نیازها**
   - Node.js 16+
   - Python 3.8+
   - PostgreSQL

2. **نصب و راه‌اندازی**

   فرانت‌اند:
   ```bash
   cd src
   npm install
   npm run dev
   ```

   بک‌اند:
   ```bash
   cd django_backend
   python -m venv venv
   .\venv\Scripts\activate  # در ویندوز
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

## 🤝 مشارکت

1. از ریپازیتوری فورک بگیرید
2. برنچ جدیدی برای ویژگی خود ایجاد کنید
3. تغییرات را کامیت کنید
4. یک پول ریکوئست باز کنید

## 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است. جزئیات بیشتر در فایل [LICENSE](LICENSE) موجود است.

## 📚 مستندات

مستندات کامل پروژه در پوشه `docs` موجود است:

- [راهنمای توسعه](./docs/DEVELOPMENT.md) - راهنمای توسعه‌دهندگان
- [راهنمای استقرار](./docs/DEPLOYMENT.md) - نحوه استقرار پروژه
- [معماری سیستم](./docs/ARCHITECTURE.md) - توضیحات معماری سیستم
- [راهنمای API](./docs/API.md) - مستندات API

## 🚀 شروع سریع

1. **پیش‌نیازها**
   - Node.js 16+
   - Python 3.8+
   - PostgreSQL

2. **نصب و راه‌اندازی**

   فرانت‌اند:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   بک‌اند:
   ```bash
   cd django_backend
   python -m venv venv
   source venv/bin/activate  # در ویندوز: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py runserver
   ```

## 🤝 مشارکت

1. از ریپازیتوری فورک بگیرید
2. برنچ جدیدی برای ویژگی خود ایجاد کنید
3. تغییرات را کامیت کنید
4. یک پول ریکوئست باز کنید
- 📱 طراحی کاملاً ریسپانسیو
- 🌙 پشتیبانی از زبان فارسی (راست‌چین)

### ⚙️ ویژگی‌های فنی
- 🔐 احراز هویت JWT
- 📊 پنل مدیریت کامل
- 🔍 جستجو و فیلتر پیشرفته
- 📄 Pagination
- 🖼️ آپلود و مدیریت تصاویر
- 📁 آپلود فایل‌های طراحی
- ✉️ سیستم ایمیل
- 📈 آمار و گزارش‌گیری

---

## 🚀 شروع سریع

### پیش‌نیازها
- Node.js 18+
- Python 3.10+
- PostgreSQL (یا SQLite برای توسعه)

### نصب و اجرا

```bash
# 1. کلون کردن پروژه
git clone https://github.com/yourusername/digichapograph.git
cd digichapograph

# 2. راه‌اندازی Backend (Django)
cd django_backend
./setup.sh  # Linux/Mac
# یا setup.bat برای Windows

# 3. راه‌اندازی Frontend (React)
cd ..
npm install
npm run dev
```

**Backend:** http://localhost:8000  
**Frontend:** http://localhost:5173  
**Admin Panel:** http://localhost:8000/admin/  
**API Docs:** http://localhost:8000/api/docs/

---

## 📁 ساختار پروژه

```
.
├── 📄 Frontend (React + TypeScript)
│   ├── App.tsx
│   ├── components/
│   ├── contexts/
│   ├── services/
│   └── styles/
│
├── 📁 django_backend/
│   ├── config/         # تنظیمات Django
│   ├── apps/           # اپلیکیشن‌ها
│   │   ├── accounts/   # کاربران
│   │   ├── services/   # خدمات
│   │   ├── portfolio/  # نمونه کارها
│   │   ├── orders/     # سفارشات
│   │   ├── contact/    # تماس
│   │   └── core/       # مشترک
│   ├── media/          # فایل‌های آپلود
│   └── requirements.txt
│
└── 📚 Documentation/
    ├── DJANGO_BACKEND_GUIDE.md
    ├── FRONTEND_BACKEND_INTEGRATION.md
    ├── DEPLOYMENT_GUIDE.md
    └── COMPLETE_PROJECT_SUMMARY.md
```

---

## 📚 مستندات

| مستند | توضیحات |
|-------|---------|
| [راهنمای Backend](DJANGO_BACKEND_GUIDE.md) | راهنمای کامل ساخت و توسعه بک‌اند Django |
| [راهنمای اتصال](FRONTEND_BACKEND_INTEGRATION.md) | نحوه اتصال React به Django |
| [راهنمای Deploy](DEPLOYMENT_GUIDE.md) | استقرار پروژه در production |
| [خلاصه پروژه](COMPLETE_PROJECT_SUMMARY.md) | خلاصه کامل و جامع پروژه |

---

## 🛠️ تکنولوژی‌ها

### Frontend
- **React 18** - کتابخانه UI
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - استایل‌دهی
- **shadcn/ui** - کامپوننت‌های UI
- **React Hook Form** - مدیریت فرم‌ها
- **Axios** - HTTP Client
- **Lucide Icons** - آیکون‌ها

### Backend
- **Django 4.2** - Web Framework
- **Django REST Framework** - API
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Celery** - Task Queue
- **Redis** - Caching
- **Pillow** - Image Processing

---

## 🌐 API Documentation

### مستندسازی خودکار
پس از اجرای Backend، می‌توانید مستندات کامل API را در آدرس‌های زیر مشاهده کنید:

- **Swagger UI:** http://localhost:8000/api/docs/
- **ReDoc:** http://localhost:8000/api/redoc/

### نمونه Endpoints

```bash
# Authentication
POST /api/v1/accounts/register/
POST /api/v1/accounts/login/

# Services
GET /api/v1/services/
GET /api/v1/services/{slug}/

# Portfolio
GET /api/v1/portfolio/
GET /api/v1/portfolio/{slug}/

# Orders
POST /api/v1/orders/create/
GET /api/v1/orders/my-orders/

# Contact
POST /api/v1/contact/send/
```

---

## 🎨 اسکرین‌شات‌ها

### صفحه اصلی
![Home](screenshots/home.png)

### خدمات
![Services](screenshots/services.png)

### نمونه کارها
![Portfolio](screenshots/portfolio.png)

### پنل مدیریت
![Admin](screenshots/admin.png)

---

## 🧪 تست

### Backend Tests
```bash
cd django_backend
python manage.py test
# یا
pytest
```

### Frontend Tests
```bash
npm run test
```

---

## 🚀 Deploy

### راهنمای Deploy
مستندات کامل Deploy در [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Deploy سریع با Docker
```bash
docker-compose up -d
```

---

## 📈 Roadmap

- [x] طراحی UI/UX
- [x] پیاده‌سازی Frontend با React
- [x] پیاده‌سازی Backend با Django
- [x] سیستم احراز هویت
- [x] مدیریت خدمات و نمونه کارها
- [x] فرم سفارش آنلاین
- [ ] درگاه پرداخت
- [ ] پنل کاربری
- [ ] اپلیکیشن موبایل
- [ ] چت آنلاین
- [ ] سیستم تیکتینگ

---

## 🤝 مشارکت

مشارکت شما در این پروژه خوش‌آمد است! لطفاً مراحل زیر را دنبال کنید:

1. Fork کنید
2. یک branch جدید بسازید (`git checkout -b feature/AmazingFeature`)
3. تغییرات را commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. Push کنید (`git push origin feature/AmazingFeature`)
5. یک Pull Request باز کنید

---

## 📝 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است. برای اطلاعات بیشتر فایل [LICENSE](LICENSE) را مطالعه کنید.

---

## 👥 نویسندگان

- **تیم توسعه** - [GitHub](https://github.com/yourusername)

---

## 🙏 تشکر

از تمام کسانی که به این پروژه کمک کرده‌اند و از کتابخانه‌ها و ابزارهای open-source استفاده شده، تشکر می‌کنیم.

---

## 📞 ارتباط با ما

- 🌐 وب‌سایت: [digichapograph.com](https://digichapograph.com)
- 📧 ایمیل: info@digichapograph.com
- 📱 تلگرام: [@digichapograph](https://t.me/digichapograph)
- 💼 لینکدین: [linkedin.com/company/digichapograph](https://linkedin.com/company/digichapograph)

---

<div align="center">

**ساخته شده با ❤️ در ایران**

[⬆ بازگشت به بالا](#-سایت-چاپ-و-گرافیک-دیجیتال---full-stack)

</div>
