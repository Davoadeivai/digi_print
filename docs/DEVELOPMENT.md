# راهنمای اجرای محلی پروژه (Development)

## پیش‌نیازها

- Python 3.10+
- Node.js 18+
- PostgreSQL (اختیاری، می‌توان از SQLite استفاده کرد)

## اجرای بک‌اند (Django)

### ویندوز

```cmd
cd backend
run-backend.bat
```

### Linux/Mac

```bash
cd backend
chmod +x run-backend.sh
./run-backend.sh
```

### دستی

```bash
cd backend

# فعال‌سازی محیط مجازی
# ویندوز:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# نصب dependencies
pip install -r requirements.txt

# Migration
python manage.py migrate

# اجرای سرور
python manage.py runserver 8000
```

بک‌اند در آدرس `http://localhost:8000` در دسترس خواهد بود.

## اجرای فرانت‌اند (React + Vite)

### ویندوز

```cmd
cd frontend
run-frontend.bat
```

### Linux/Mac

```bash
cd frontend
chmod +x run-frontend.sh
./run-frontend.sh
```

### دستی

```bash
cd frontend

# نصب dependencies
npm install

# اجرای development server
npm run dev
```

فرانت‌اند در آدرس `http://localhost:5173` در دسترس خواهد بود.

## Environment Variables

### Backend `.env`

از `backend/.env.example` کپی کنید:

```bash
cd backend
cp .env.example .env
```

کلیدهای مهم:
- `DEBUG=True` 
- `SECRET_KEY=your-secret-key`
- `CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`

### Frontend Environment Files

فایل‌های `.env.development` و `.env.production` از قبل ایجاد شده‌اند:

- **`.env.development`**: API به `http://localhost:8000/api/v1` متصل می‌شود
- **`.env.production`**: API به `/api/v1` (همان دامنه) متصل می‌شود

## ساختار پروژه

```
Daidi_print/
├── backend/           # Django REST API
│   ├── apps/         # Django apps
│   ├── config/       # Settings
│   ├── manage.py
│   └── run-backend.bat/sh
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── services/  # API clients
│   │   └── main.tsx
│   ├── public/
│   └── run-frontend.bat/sh
└── README.md
```

## API Documentation

بک‌اند در حال اجرا باید باشد، سپس:
- API Root: `http://localhost:8000/api/v1/`
- Admin Panel: `http://localhost:8000/admin/`

## تست ارتباط فرانت و بک

1. بک‌اند را روی پورت 8000 اجرا کنید
2. فرانت‌اند را روی پورت 5173 اجرا کنید
3. در مرورگر به `http://localhost:5173` بروید
4. Developer Console باز کنید (F12)
5. در Network tab بررسی کنید که requestها به `http://localhost:8000/api/v1/` ارسال می‌شوند

## مشکلات متداول

### خطای CORS
**علت**: `CORS_ALLOWED_ORIGINS` در backend به درستی تنظیم نشده  
**راه‌حل**: در `backend/.env` مطمئن شوید که `http://localhost:5173` وجود دارد

### Cannot connect to API
**علت**: Backend در حال اجرا نیست  
**راه‌حل**: مطمئن شوید backend روی پورت 8000 در حال اجرا است

### Module not found errors
**راه‌حل**: dependencies را دوباره نصب کنید:
```bash
# Backend
pip install -r backend/requirements.txt

# Frontend
cd frontend && npm install
```
