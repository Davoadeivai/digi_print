# دیجی چاپ و گرافیک 🖨️

سیستم مدیریت خدمات چاپ و طراحی گرافیک با معماری جداسازی شده Frontend و Backend

## 🏗️ معماری پروژه

این پروژه به دو بخش مجزا تقسیم شده است:

- **Backend**: Django REST Framework (پورت 8000)
- **Frontend**: React + TypeScript + Vite (پورت 5173)

## 🛠️ فناوری‌های استفاده شده

### Backend
- Django 5.0.1
- Django REST Framework
- PostgreSQL / SQLite
- JWT Authentication
- CORS Headers

### Frontend
- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- React Router

## 🚀 اجرای محلی (Development)

### روش سریع

#### بک‌اند
```bash
cd backend
# Windows:
run-backend.bat
# Linux/Mac:
./run-backend.sh
```

#### فرانت‌اند
```bash
cd frontend
# Windows:
run-frontend.bat
# Linux/Mac:
./run-frontend.sh
```

### مستندات کامل

برای اطلاعات بیشتر درباره اجرای محلی، مشاهده کنید: [DEVELOPMENT.md](./DEVELOPMENT.md)

## 📦 دیپلوی در Render

برای راهنمای کامل deployment در Render.com، مشاهده کنید: 
- [راهنمای دیپلوی Render](./artifacts/RENDER_DEPLOYMENT.md)

### خلاصه مراحل دیپلوی

1. **Backend**: Web Service با Python runtime
2. **Frontend**: Static Site با Node.js build
3. **Database**: PostgreSQL service
4. تنظیم Environment Variables
5. اتصال سرویس‌ها

## 📁 ساختار پروژه

```
Daidi_print/
├── backend/              # Django REST API
│   ├── apps/            # Django apps
│   ├── config/          # Settings & URLs
│   ├── manage.py
│   ├── requirements.txt
│   └── run-backend.bat/sh
│
├── frontend/            # React Application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API clients
│   │   └── main.tsx
│   ├── public/
│   │   └── _redirects   # SPA routing config
│   ├── package.json
│   └── run-frontend.bat/sh
│
├── DEVELOPMENT.md       # راهنمای توسعه
├── render.yaml          # Render deployment config
└── README.md            # این فایل
```

## 🔑 Environment Variables

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key
CORS_ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=...
```

### Frontend (.env.development)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 🌐 API Endpoints

با بک‌اند در حال اجرا:
- API Root: `http://localhost:8000/api/v1/`
- Admin Panel: `http://localhost:8000/admin/`
- Health Check: `http://localhost:8000/api/health/`

## 🔧 Scripts مفید

### Backend
```bash
cd backend
python manage.py migrate        # اجرای migrations
python manage.py createsuperuser  # ایجاد admin user
python manage.py test           # اجرای تست‌ها
```

### Frontend
```bash
cd frontend
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Check code quality
```

## 🐛 عیب‌یابی

### خطای CORS
مطمئن شوید `CORS_ALLOWED_ORIGINS` در `backend/.env` شامل `http://localhost:5173` است.

### Connection Refused
- بررسی کنید که بک‌اند در حال اجرا باشد
- مطمئن شوید پورت‌ها درست تنظیم شده‌اند

### Module Not Found
```bash
# Backend
pip install -r backend/requirements.txt

# Frontend
cd frontend && npm install
```

## 📖 مستندات بیشتر

- [راهنمای توسعه](./DEVELOPMENT.md) - اجرای محلی و تست
- [راهنمای دیپلوی Render](./artifacts/RENDER_DEPLOYMENT.md) - deployment در production

## 🤝 مشارکت

1. Fork کنید
2. Branch جدید: `git checkout -b feature/new-feature`
3. Commit کنید: `git commit -m 'Add new feature'`
4. Push کنید: `git push origin feature/new-feature`
5. Pull Request ایجاد کنید

## 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است.

---

<div align="center">
  ساخته شده با ❤️ برای دیجی چاپ و گرافیک
</div>