# 📚 مستندات فایل‌های مشترک - پروژه دیجی چاپ و گرافیک

## 📋 فهرست مطالب
- [فایل‌های تنظیمات](#فایل‌های-تنظیمات)
- [فایل‌های Deployment](#فایل‌های-deployment)
- [Docker و Containerization](#docker-و-containerization)
- [اسکریپت‌های اجرایی](#اسکریپت‌های-اجرایی)
- [فایل‌های مستندات](#فایل‌های-مستندات)

---

## ⚙️ فایل‌های تنظیمات

### 📄 `package.json` (Root)
**مسیر**: `Daidi_print/package.json`  
**وظیفه**: تنظیمات npm برای کل پروژه

```json
{
  "name": "daidi-print",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && python manage.py runserver",
    "dev:frontend": "cd frontend && npm run dev"
  }
}
```

**Scripts کلیدی**:
- `dev`: اجرای همزمان Backend و Frontend
- `dev:backend`: اجرای سرور Django
- `dev:frontend`: اجرای سرور Vite

---

### 📄 `.env.example`
**مسیر**: `Daidi_print/.env.example`  
**وظیفه**: نمونه فایل متغیرهای محیطی

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Frontend
FRONTEND_URL=http://localhost:5173

# JWT
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=1440
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7
```

**متغیرهای کلیدی**:
- `DEBUG`: حالت دیباگ (True در development، False در production)
- `SECRET_KEY`: کلید مخفی Django
- `DATABASE_URL`: آدرس اتصال به دیتابیس
- `CORS_ALLOWED_ORIGINS`: دامنه‌های مجاز برای CORS
- `JWT_*`: تنظیمات توکن JWT

---

### 📄 `.gitignore`
**مسیر**: `Daidi_print/.gitignore`  
**وظیفه**: فایل‌های نادیده گرفته شده توسط Git

**بخش‌های اصلی**:
```
# Python
__pycache__/
*.py[cod]
*.so
.Python
venv/
.env

# Node
node_modules/
dist/
build/

# Database
*.sqlite3
*.db

# IDE
.vscode/
.idea/
```

**وظیفه**: جلوگیری از commit شدن فایل‌های غیرضروری و حساس

---

## 🚀 فایل‌های Deployment

### 📄 `render.yaml`
**مسیر**: `Daidi_print/render.yaml`  
**وظیفه**: تنظیمات deployment در Render.com

```yaml
services:
  # Backend Service
  - type: web
    name: daidi-print-backend
    env: python
    buildCommand: "pip install -r backend/requirements.txt && python backend/manage.py collectstatic --noinput && python backend/manage.py migrate"
    startCommand: "gunicorn config.wsgi:application"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: DATABASE_URL
        fromDatabase:
          name: daidi-print-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: False

  # Frontend Service
  - type: web
    name: daidi-print-frontend
    env: static
    buildCommand: "cd frontend && npm install && npm run build"
    staticPublishPath: frontend/dist
    envVars:
      - key: NODE_VERSION
        value: 18

  # Database
  - type: pgsql
    name: daidi-print-db
    databaseName: daidi_print
    user: daidi_admin
```

**سرویس‌ها**:
1. **Backend** (خطوط 2-16):
   - نوع: Web Service
   - زبان: Python
   - Build Command: نصب dependencies + collectstatic + migrate
   - Start Command: اجرا با Gunicorn

2. **Frontend** (خطوط 18-25):
   - نوع: Static Site
   - Build Command: نصب npm packages + build
   - Publish Path: فولدر dist

3. **Database** (خطوط 27-31):
   - نوع: PostgreSQL
   - نام دیتابیس: daidi_print

---

### 📄 `Dockerfile`
**مسیر**: `Daidi_print/Dockerfile`  
**وظیفه**: ساخت Docker image برای Backend

```dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY backend/ .

# Collect static files
RUN python manage.py collectstatic --noinput

# Run gunicorn
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

**مراحل Build**:
1. **Base Image** (خط 1): Python 3.11 slim
2. **Environment Variables** (خطوط 3-5): تنظیمات Python
3. **Dependencies** (خطوط 10-13): نصب requirements
4. **Copy Files** (خط 16): کپی کدهای Backend
5. **Static Files** (خط 19): جمع‌آوری فایل‌های استاتیک
6. **Run** (خط 22): اجرا با Gunicorn

---

### 📄 `docker-compose.yml`
**مسیر**: `Daidi_print/docker-compose.yml`  
**وظیفه**: تنظیمات Docker Compose برای اجرای محلی

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=daidi_print
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://admin:password@db:5432/daidi_print
      - DEBUG=True

  frontend:
    image: node:18
    working_dir: /app
    command: npm run dev
    volumes:
      - ./frontend:/app
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**سرویس‌ها**:
1. **db**: PostgreSQL database
2. **backend**: Django application
3. **frontend**: React application

**استفاده**:
```bash
docker-compose up -d
```

---

## 📜 اسکریپت‌های اجرایی

### 📄 `build.sh`
**مسیر**: `Daidi_print/build.sh`  
**وظیفه**: اسکریپت build برای deployment

```bash
#!/bin/bash

echo "Building backend..."
cd backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate

echo "Building frontend..."
cd ../frontend
npm install
npm run build

echo "Build completed!"
```

**مراحل**:
1. نصب dependencies Backend
2. جمع‌آوری static files
3. اجرای migrations
4. نصب dependencies Frontend
5. Build کردن Frontend

---

### 📄 `backend/run-backend.sh` و `backend/run-backend.bat`
**مسیر**: `backend/run-backend.sh` (Linux/Mac) و `backend/run-backend.bat` (Windows)  
**وظیفه**: اجرای سریع Backend

**run-backend.sh**:
```bash
#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Run server
python manage.py runserver
```

**run-backend.bat**:
```batch
@echo off

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
pip install -r requirements.txt

REM Run migrations
python manage.py migrate

REM Run server
python manage.py runserver
```

---

### 📄 `frontend/run-frontend.sh` و `frontend/run-frontend.bat`
**مسیر**: `frontend/run-frontend.sh` (Linux/Mac) و `frontend/run-frontend.bat` (Windows)  
**وظیفه**: اجرای سریع Frontend

**run-frontend.sh**:
```bash
#!/bin/bash

# Install dependencies
npm install

# Run dev server
npm run dev
```

**run-frontend.bat**:
```batch
@echo off

REM Install dependencies
npm install

REM Run dev server
npm run dev
```

---

### 📄 `backend/setup.sh` و `backend/setup.bat`
**وظیفه**: راه‌اندازی اولیه Backend

**مراحل**:
1. ایجاد virtual environment
2. نصب dependencies
3. ایجاد فایل .env
4. اجرای migrations
5. ایجاد superuser

---

## 📚 فایل‌های مستندات

### 📄 `README.md`
**مسیر**: `Daidi_print/README.md`  
**خطوط**: 173 خط  
**وظیفه**: مستندات اصلی پروژه

**بخش‌های کلیدی**:
- معرفی پروژه
- فناوری‌های استفاده شده
- راهنمای اجرای محلی
- راهنمای deployment
- ساختار پروژه
- متغیرهای محیطی
- API Endpoints
- عیب‌یابی

---

### 📄 `DEVELOPMENT.md`
**مسیر**: `Daidi_print/DEVELOPMENT.md`  
**وظیفه**: راهنمای توسعه

**محتوا**:
- نصب و راه‌اندازی محیط توسعه
- اجرای تست‌ها
- استانداردهای کدنویسی
- ساختار پروژه
- راهنمای مشارکت

---

## 🔧 فایل‌های تنظیمات خاص

### 📄 `backend/requirements.txt`
**وظیفه**: لیست کتابخانه‌های Python

```
Django==5.0.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.3.1
django-filter==23.5
psycopg2-binary==2.9.9
gunicorn==21.2.0
python-dotenv==1.0.0
dj-database-url==2.1.0
Pillow==10.2.0
```

**کتابخانه‌های اصلی**:
- Django: فریمورک اصلی
- DRF: REST API
- JWT: احراز هویت
- CORS: ارتباط با Frontend
- PostgreSQL: دیتابیس
- Gunicorn: WSGI server

---

### 📄 `frontend/package.json`
**وظیفه**: تنظیمات npm Frontend

```json
{
  "name": "daidi-print-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

**Scripts**:
- `dev`: اجرای development server
- `build`: Build برای production
- `preview`: پیش‌نمایش build
- `lint`: بررسی کیفیت کد

---

### 📄 `frontend/vite.config.ts`
**وظیفه**: تنظیمات Vite

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

**تنظیمات**:
- Plugin React
- Alias برای import ها
- Port سرور: 5173
- Proxy برای API requests

---

### 📄 `frontend/tsconfig.json`
**وظیفه**: تنظیمات TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### 📄 `frontend/tailwind.config.js`
**وظیفه**: تنظیمات Tailwind CSS

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b5cf6',
          50: '#faf5ff',
          100: '#f3e8ff',
          // ...
        },
      },
      fontFamily: {
        sans: ['IRANSans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 📊 خلاصه فایل‌های مشترک

### فایل‌های تنظیمات
- `.env.example`: نمونه متغیرهای محیطی
- `.gitignore`: فایل‌های نادیده گرفته شده
- `package.json`: تنظیمات npm
- `requirements.txt`: کتابخانه‌های Python

### فایل‌های Deployment
- `render.yaml`: تنظیمات Render.com
- `Dockerfile`: Docker image Backend
- `docker-compose.yml`: اجرای محلی با Docker
- `build.sh`: اسکریپت build

### اسکریپت‌های اجرایی
- `run-backend.sh/bat`: اجرای Backend
- `run-frontend.sh/bat`: اجرای Frontend
- `setup.sh/bat`: راه‌اندازی اولیه

### مستندات
- `README.md`: مستندات اصلی
- `DEVELOPMENT.md`: راهنمای توسعه

---

## 🔐 نکات امنیتی

1. **فایل .env**: هرگز commit نشود
2. **SECRET_KEY**: در production تغییر کند
3. **DEBUG**: در production False باشد
4. **ALLOWED_HOSTS**: فقط دامنه‌های مجاز
5. **Database Credentials**: از متغیرهای محیطی استفاده شود

---

## 🚀 دستورات مفید

### اجرای محلی
```bash
# Backend
cd backend
python manage.py runserver

# Frontend
cd frontend
npm run dev

# Docker
docker-compose up -d
```

### Deployment
```bash
# Build
./build.sh

# Deploy to Render
git push origin main
```

---

**تاریخ ایجاد مستند**: 2025-12-02  
**نسخه**: 1.0.0
