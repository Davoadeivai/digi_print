# 📘 مستندات کامل پروژه چاپ و گرافیک دیجیتال

## فهرست مطالب
- [معرفی پروژه](#-معرفی-پروژه)
- [ساختار پروژه](#-ساختار-پروژه)
- [راهنمای نصب و راه‌اندازی](#-نصب-و-راه‌اندازی)
- [معماری سیستم](#-معماری-سیستم)
- [راهنمای توسعه](#-راهنمای-توسعه)
- [راهنمای استقرار](#-استقرار-و-پیکربندی)
- [وظایف آینده](#-وظایف-آینده)

## 🎯 معرفی پروژه

یک سیستم جامع مدیریت چاپ و گرافیک دیجیتال با قابلیت‌های:

### فناوری‌های اصلی
- **فرانت‌اند:** React + TypeScript + Tailwind CSS + shadcn/ui
- **بک‌اند:** Django + Django REST Framework
- **پایگاه داده:** PostgreSQL
- **استقرار:** Nginx + Gunicorn

### ویژگی‌های کلیدی
- احراز هویت و مدیریت کاربران
- مدیریت خدمات چاپ و گرافیک
- گالری نمونه کارها
- سبد خرید و سفارش آنلاین
- پنل مدیریت
- پشتیبانی از چند زبانه
- طراحی ریسپانسیو

## 🎯 نمای کلی پروژه

یک سیستم کامل Full-Stack شامل:
- **Frontend:** React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Django + Django REST Framework + PostgreSQL
- **Features:** سیستم احراز هویت، مدیریت خدمات، نمونه کارها، سفارش‌گیری آنلاین

---

## 🏗️ ساختار پروژه

### ساختار فایل‌ها
```
project-root/
├── src/                           # کدهای فرانت‌اند
│   ├── components/               # کامپوننت‌های ری‌اکت
│   ├── services/                 # سرویس‌های API
│   ├── contexts/                 # کانتکست‌های ری‌اکت
│   ├── styles/                   # استایل‌ها
│   ├── App.tsx                   # کامپوننت اصلی
│   └── main.tsx                  # نقطه ورود
│
└── django_backend/              # بک‌اند جنگو
    ├── config/                  # تنظیمات پروژه
    ├── apps/                    # اپلیکیشن‌های جنگو
    │   ├── accounts/           # مدیریت کاربران
    │   ├── services/           # خدمات چاپ و گرافیک
    │   └── portfolio/          # نمونه کارها
    ├── media/                  # فایل‌های رسانه
    └── static/                 # فایل‌های استاتیک
```

### توضیحات ماژول‌ها

#### فرانت‌اند
- **components/**: شامل تمام کامپوننت‌های قابل استفاده مجدد
- **services/**: سرویس‌های ارتباط با بک‌اند
- **contexts/**: مدیریت وضعیت سراسری
- **styles/**: استایل‌های عمومی و تم‌ها

#### بک‌اند
- **accounts/**: مدیریت کاربران و احراز هویت
- **services/**: ماژول خدمات چاپ و گرافیک
- **portfolio/**: مدیریت نمونه کارها
- **orders/**: مدیریت سفارشات

```
project-root/
├── 📁 Frontend (React)
│   ├── App.tsx                          # کامپوننت اصلی
│   ├── components/                      # کامپوننت‌های React
│   │   ├── About.tsx                   # درباره ما
│   │   ├── Contact.tsx                 # فرم تماس
│   │   ├── Footer.tsx                  # فوتر
│   │   ├── Header.tsx                  # هدر و منو
│   │   ├── Hero.tsx                    # بنر اصلی
│   │   ├── Portfolio.tsx               # نمونه کارها
│   │   ├── Services.tsx                # خدمات
│   │   ├── admin/                      # پنل ادمین
│   │   │   ├── AdminLogin.tsx
│   │   │   └── AdminPanel.tsx
│   │   ├── pages/                      # صفحات
│   │   │   ├── OrderPage.tsx          # صفحه سفارش
│   │   │   ├── PortfolioDetailPage.tsx
│   │   │   └── ServiceDetailPage.tsx
│   │   └── ui/                         # shadcn components
│   ├── contexts/                        # Context API
│   │   ├── AuthContext.tsx             # مدیریت احراز هویت
│   │   ├── BackendContext.tsx          # شبیه‌ساز Backend
│   │   └── NavigationContext.tsx       # مدیریت Navigation
│   ├── services/                        # API Services
│   │   └── api.ts                      # تماس‌های API
│   └── styles/
│       └── globals.css                 # استایل‌های کلی
│
└── 📁 Backend (Django)
    ├── manage.py                        # مدیریت Django
    ├── requirements.txt                 # وابستگی‌های Python
    ├── .env                            # متغیرهای محیطی
    ├── setup.sh / setup.bat            # اسکریپت راه‌اندازی
    │
    ├── config/                          # تنظیمات پروژه
    │   ├── settings.py                 # تنظیمات اصلی
    │   ├── urls.py                     # مسیریابی
    │   ├── wsgi.py                     # WSGI
    │   ├── asgi.py                     # ASGI
    │   └── celery.py                   # Celery
    │
    └── apps/                            # اپلیکیشن‌ها
        ├── accounts/                    # کاربران
        ├── services/                    # خدمات
        ├── portfolio/                   # نمونه کارها
        ├── orders/                      # سفارشات
        ├── contact/                     # تماس
        └── core/                        # مشترک
```

---

## 🚀 راه‌اندازی سریع

### مرحله 1: Backend (Django)

```bash
cd django_backend

# روش خودکار (پیشنهادی)
./setup.sh          # Linux/Mac
setup.bat           # Windows

# یا روش دستی
python -m venv venv
source venv/bin/activate  # یا venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# ویرایش .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Backend اجرا می‌شود در:** `http://localhost:8000`

### مرحله 2: Frontend (React)

```bash
# در پوشه اصلی پروژه
npm install
npm run dev
```

**Frontend اجرا می‌شود در:** `http://localhost:5173`

### مرحله 3: اتصال Frontend به Backend

1. فایل `.env.local` در ریشه Frontend ایجاد کنید:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

2. فایل `services/api.ts` را با نسخه واقعی جایگزین کنید (راهنما در `FRONTEND_BACKEND_INTEGRATION.md`)

---

## 📚 مستندات موجود

| فایل | توضیحات |
|------|---------|
| `README.md` | راهنمای کامل پروژه |

---

## 🔑 ویژگی‌های کلیدی

### Frontend Features

✅ **طراحی مدرن و ریسپانسیو**
- Tailwind CSS برای استایل‌دهی
- shadcn/ui برای کامپوننت‌های UI
- طراحی راست‌چین فارسی

✅ **سیستم Navigation**
- Navigation Context برای مدیریت صفحات
- Smooth Scrolling
- Mobile Menu

✅ **صفحات و بخش‌ها**
- صفحه اصلی با Hero Section
- بخش خدمات با فیلتر
- نمونه کارها با گالری
- فرم تماس با اعتبارسنجی
- فرم سفارش 4 مرحله‌ای
- درباره ما

✅ **پنل ادمین**
- مدیریت خدمات
- مدیریت سفارشات
- مدیریت پیام‌ها
- آمار و گزارش‌گیری

### Backend Features

✅ **RESTful API کامل**
- Django REST Framework
- مستندسازی خودکار (Swagger)
- Pagination, Filtering, Search

✅ **احراز هویت**
- JWT Authentication
- User Registration & Login
- Password Reset
- Profile Management

✅ **مدیریت محتوا**
- خدمات با دسته‌بندی
- نمونه کارها
- گالری تصاویر
- SEO-friendly URLs (slug)

✅ **سیستم سفارش**
- فرم سفارش آنلاین
- آپلود فایل
- مدیریت وضعیت
- محاسبه قیمت

✅ **پنل مدیریت**
- Django Admin فارسی
- مدیریت کامل داده‌ها
- آمارگیری
- لاگ‌ها

✅ **امنیت**
- CORS Configuration
- Rate Limiting
- Input Validation
- SQL Injection Protection

---

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/accounts/register/` - ثبت‌نام
- `POST /api/v1/accounts/login/` - ورود
- `POST /api/v1/accounts/token/refresh/` - تمدید توکن
- `GET /api/v1/accounts/profile/` - پروفایل
- `POST /api/v1/accounts/change-password/` - تغییر رمز

### Services
- `GET /api/v1/services/categories/` - دسته‌بندی‌ها
- `GET /api/v1/services/` - لیست خدمات
- `GET /api/v1/services/{slug}/` - جزئیات خدمت

### Portfolio
- `GET /api/v1/portfolio/categories/` - دسته‌بندی‌ها
- `GET /api/v1/portfolio/` - لیست نمونه کارها
- `GET /api/v1/portfolio/{slug}/` - جزئیات نمونه کار

### Orders
- `POST /api/v1/orders/create/` - ثبت سفارش
- `GET /api/v1/orders/my-orders/` - سفارشات من
- `GET /api/v1/orders/{order_number}/` - جزئیات سفارش
- `POST /api/v1/orders/{order_number}/upload/` - آپلود فایل

### Contact
- `POST /api/v1/contact/send/` - ارسال پیام

### Documentation
- `GET /api/docs/` - Swagger UI
- `GET /api/redoc/` - ReDoc

---

## 🗂️ دیتابیس Schema

### User (کاربران)
- id, email, full_name, phone, company
- is_staff, is_active, date_joined

### Service (خدمات)
- title, slug, description, image
- category, price, features
- is_active, is_featured

### Portfolio (نمونه کارها)
- title, slug, description, featured_image
- category, client, completion_date
- tags, technologies

### Order (سفارشات)
- order_number, customer info
- status, payment_status
- total_price, discount, final_price

### OrderItem (آیتم‌های سفارش)
- service, quantity, unit_price
- specifications, notes

### ContactMessage (پیام‌ها)
- full_name, email, phone, subject, message
- is_read, is_replied

---

## 🔧 تکنولوژی‌ها

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui
- Lucide Icons
- React Hook Form
- Sonner (Toast)
- Axios

### Backend
- Python 3.10+
- Django 4.2
- Django REST Framework
- PostgreSQL
- Celery & Redis (اختیاری)
- Pillow (Image Processing)
- JWT Authentication

---

## 🎨 طراحی و UI/UX

### رنگ‌ها
```css
--primary: #3b82f6      /* آبی اصلی */
--secondary: #8b5cf6    /* بنفش */
--accent: #10b981       /* سبز */
--background: #ffffff   /* پس‌زمینه */
--foreground: #1f2937   /* متن */
```

### فونت
- فارسی: Vazirmatn
- انگلیسی: Inter

### ریسپانسیو
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🧪 تست

### Backend Tests
```bash
cd django_backend
python manage.py test
# یا
pytest
```

### Frontend Tests (قریب الوقوع)
```bash
npm run test
```

---

## 📦 Deploy

### Backend (Production)

```bash
# تنظیمات .env برای production
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
SECRET_KEY=long-random-secret-key

# اجرا با Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000

# یا با Docker
docker-compose up -d
```

### Frontend (Production)

```bash
npm run build
# فایل‌های build در dist/
```

برای جزئیات بیشتر: `DEPLOYMENT_GUIDE.md`

---

## 📞 پشتیبانی و مستندات

### لینک‌های مفید
- **Django Docs:** https://docs.djangoproject.com/
- **DRF Docs:** https://www.django-rest-framework.org/
- **React Docs:** https://react.dev/
- **Tailwind Docs:** https://tailwindcss.com/
- **shadcn/ui:** https://ui.shadcn.com/

### API Testing
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- Django Admin: `http://localhost:8000/admin/`

---

## ✅ Checklist پروژه

### Backend Setup
- [x] Django نصب شده
- [x] مدل‌ها ایجاد شده
- [x] API ها نوشته شده
- [x] پنل ادمین تنظیم شده
- [x] Authentication پیاده‌سازی شده
- [x] CORS تنظیم شده
- [x] Swagger مستندسازی شده

### Frontend Setup
- [x] React راه‌اندازی شده
- [x] کامپوننت‌ها ایجاد شده
- [x] Context API پیاده‌سازی شده
- [x] Routing تنظیم شده
- [x] فرم‌ها با validation
- [x] ریسپانسیو دیزاین
- [x] راست‌چین فارسی

### Integration
- [ ] API اتصال داده شود
- [ ] Authentication واقعی
- [ ] Image Upload
- [ ] File Management
- [ ] Error Handling

### Testing
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] E2E Tests
- [ ] Performance Testing

### Deployment
- [ ] Production Settings
- [ ] SSL Certificate
- [ ] CI/CD Pipeline
- [ ] Monitoring
- [ ] Backup Strategy

---

## 🎓 یادگیری و توسعه

### مرحله 1: آشنایی با کد
1. بررسی فایل‌های `DJANGO_BACKEND_GUIDE.md` و `FRONTEND_BACKEND_INTEGRATION.md`
2. خواندن کدهای موجود
3. اجرای پروژه به صورت local

### مرحله 2: کار با API
1. تست API ها در Swagger
2. اتصال Frontend به Backend
3. مشاهده داده‌های واقعی

### مرحله 3: توسعه
1. اضافه کردن ویژگی‌های جدید
2. بهبود UI/UX
3. بهینه‌سازی Performance

### مرحله 4: Deploy
1. آماده‌سازی برای Production
2. استقرار Backend و Frontend
3. تست نهایی

---

## 💡 نکات مهم

### امنیت
- ✅ همیشه `SECRET_KEY` را تغییر دهید
- ✅ `DEBUG=False` در production
- ✅ از HTTPS استفاده کنید
- ✅ Input Validation را فراموش نکنید
- ✅ CORS را درست تنظیم کنید

### Performance
- ✅ از caching استفاده کنید
- ✅ تصاویر را optimize کنید
- ✅ از CDN استفاده کنید
- ✅ Database queries را بهینه کنید

### Best Practices
- ✅ کد را clean و readable نگه دارید
- ✅ کامنت‌گذاری مناسب
- ✅ Version Control (Git)
- ✅ مستندسازی
- ✅ Testing

---

## 🤝 مشارکت

این پروژه آماده برای توسعه و بهبود است. برای مشارکت:

1. Fork کنید
2. یک branch جدید بسازید
3. تغییرات را commit کنید
4. Pull Request بزنید

---

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

---

## 🙏 تشکر

از تمام کسانی که به این پروژه کمک کرده‌اند، سپاسگزاریم!

---

**آماده برای شروع؟ 🚀**

1. Backend را راه‌اندازی کنید
2. Frontend را اجرا کنید
3. از سایت خود لذت ببرید!

**موفق باشید! 🎉**
