@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

REM ====================================
REM اسکریپت راه‌اندازی خودکار Django Backend برای Windows
REM نسخه بهبود یافته - 1402/08/23
REM ====================================

echo ========================================
echo   راه‌اندازی بک‌اند Django
echo ========================================
echo.

REM بررسی نسخه پایتون
echo [1/10] بررسی نسخه پایتون...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [خطا] Python نصب نیست یا در متغیرهای سیستمی تعریف نشده است!
    echo لطفا ابتدا Python 3.8 یا بالاتر را از python.org نصب کنید.
    echo حتما تیک 'Add Python to PATH' را در حین نصب فعال کنید.
    pause
    exit /b 1
)
python -c "import sys; exit(0) if sys.version_info >= (3, 8) else exit(1)" >nul 2>&1
if %errorlevel% neq 0 (
    echo [خطا] نسخه پایتون باید 3.8 یا بالاتر باشد.
    pause
    exit /b 1
)
python --version
echo [OK] نسخه پایتون مناسب است

REM بررسی وجود PostgreSQL
echo.
echo [2/10] بررسی نصب PostgreSQL...
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo [هشدار] PostgreSQL یافت نشد.
    echo [!] برای اجرای پروژه به PostgreSQL نیاز دارید.
    echo    لطفا از آدرس زیر دانلود و نصب کنید:
    echo    https://www.postgresql.org/download/windows/
    echo.
    set /p continue_setup="آیا می‌خواهید ادامه دهید؟ (y/n): "
    if /i not "!continue_setup!"=="y" (
        exit /b 1
    )
) else (
    psql --version
    echo [OK] PostgreSQL نصب شده است
)

REM ایجاد محیط مجازی
echo.
echo [3/10] ایجاد محیط مجازی...
if not exist "venv" (
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [خطا] خطا در ایجاد محیط مجازی
        pause
        exit /b 1
    )
    echo [OK] محیط مجازی ایجاد شد
) else (
    echo [!] محیط مجازی قبلا وجود دارد
)

REM فعال‌سازی محیط مجازی
echo.
echo [4/10] فعال‌سازی محیط مجازی...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo [خطا] خطا در فعال‌سازی محیط مجازی
    pause
    exit /b 1
)
echo [OK] محیط مجازی فعال شد

REM ارتقای pip
echo.
echo [5/10] ارتقای pip...
python -m pip install --upgrade pip
if %errorlevel% neq 0 (
    echo [خطا] خطا در به‌روزرسانی pip
    pause
    exit /b 1
)
pip --version
echo [OK] pip به‌روزرسانی شد

REM نصب پکیج‌ها
echo.
echo [6/10] نصب پکیج‌ها (ممکن است چند دقیقه طول بکشد)...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [هشدار] خطا در نصب برخی از پکیج‌ها
    echo [!] تلاش مجدد با اتصال به منبع دیگر...
    pip install -r requirements.txt -i https://pypi.org/simple/
    if %errorlevel% neq 0 (
        echo [خطا] نصب پکیج‌ها با مشکل مواجه شد
        pause
        exit /b 1
    )
)
echo [OK] پکیج‌ها با موفقیت نصب شدند

REM کپی فایل .env
echo.
echo [7/10] تنظیم فایل .env...
if not exist ".env" (
    if exist ".env.example" (
        copy /y .env.example .env >nul
        echo [OK] فایل .env از روی الگو ایجاد شد
    ) else (
        echo [هشدار] فایل .env.example یافت نشد. ایجاد فایل .env خالی...
        echo # Django Settings> .env
        echo SECRET_KEY=django-insecure-$(python -c "import secrets; print(secrets.token_urlsafe(50))" ^| findstr /v "^$")>> .env
        echo DEBUG=True>> .env
        echo ALLOWED_HOSTS=localhost,127.0.0.1>> .env
        echo.>> .env
        echo # Database Settings>> .env
        echo DB_ENGINE=django.db.backends.postgresql>> .env
        echo DB_NAME=daidi_db>> .env
        echo DB_USER=postgres>> .env
        echo DB_PASSWORD=postgres>> .env
        echo DB_HOST=localhost>> .env
        echo DB_PORT=5432>> .env
        echo.>> .env
        echo # Security Settings>> .env
        echo CSRF_COOKIE_SECURE=False>> .env
        echo SESSION_COOKIE_SECURE=False>> .env
        echo.>> .env
        echo # Media & Static>> .env
        echo STATIC_URL=/static/>> .env
        echo MEDIA_URL=/media/>> .env
        echo [OK] فایل .env با مقادیر پیش‌فرض ایجاد شد
    )
) else (
    echo [!] فایل .env قبلا وجود دارد
)

REM بررسی متغیرهای ضروری
echo.
echo [8/10] بررسی متغیرهای محیطی...
set MISSING_VARS=0

for %%v in (SECRET_KEY DB_NAME DB_USER DB_PASSWORD) do (
    findstr /i /c:"%%v=" .env >nul
    if !errorlevel! equ 1 (
        echo [هشدار] متغیر %%v در فایل .env تنظیم نشده است
        set /a MISSING_VARS+=1
    )
)

if !MISSING_VARS! gtr 0 (
    echo [!] لطفا فایل .env را بررسی و مقادیر ضروری را تنظیم کنید
    pause
    exit /b 1
)
echo [OK] متغیرهای ضروری تنظیم شده‌اند

REM ایجاد پوشه‌ها
echo.
echo [9/10] ایجاد پوشه‌های ضروری...
for %%d in (
    "media" 
    "media/services" 
    "media/portfolio" 
    "media/uploads" 
    "static" 
    "staticfiles"
    "logs"
) do (
    if not exist "%%~d" (
        mkdir "%%~d"
        echo [ساخت] %%~d
    )
)
echo [OK] پوشه‌های ضروری ایجاد شدند

REM مهاجرت دیتابیس
echo.
echo [10/10] راه‌اندازی پایگاه داده...

echo.   - اعمال مهاجرت‌ها...
python manage.py makemigrations --noinput
if %errorlevel% neq 0 (
    echo [هشدار] خطا در ایجاد مهاجرت‌ها
    pause
    exit /b 1
)

python manage.py migrate --noinput
if %errorlevel% neq 0 (
    echo [هشدار] خطا در اعمال مهاجرت‌ها
    pause
    exit /b 1
)

echo.   - جمع‌آوری فایل‌های استاتیک...
python manage.py collectstatic --noinput --clear
if %errorlevel% neq 0 (
    echo [هشدار] خطا در جمع‌آوری فایل‌های استاتیک
    pause
    exit /b 1
)

echo [OK] راه‌اندازی پایگاه داده با موفقیت انجام شد

REM سوپریوزر
echo.
echo ========================================
echo   راه‌اندازی با موفقیت انجام شد!
echo ========================================
echo.

set /p createsu="آیا می‌خواهید سوپریوزر ایجاد کنید؟ (y/n): "
if /i "!createsu!"=="y" (
    python manage.py createsuperuser --username=admin --email=admin@example.com
    if %errorlevel% neq 0 (
        echo [هشدار] خطا در ایجاد سوپر یوزر. ممکن است کاربر از قبل وجود داشته باشد.
    )
)

echo.
echo ========================================
echo   راه‌اندازی کامل شد!
echo ========================================
echo.

echo [دستورات مفید]
echo 1. اجرای سرور توسعه:
   echo    python manage.py runserver
echo.
echo 2. اجرای تست‌ها:
   echo    python manage.py test
echo.
echo 3. مشاهده لاگ‌ها:
   echo    type logs\debug.log
echo.

echo [آدرس‌های مهم]
echo   - پنل ادمین:       http://localhost:8000/admin/
echo   - مستندات API:     http://localhost:8000/api/docs/
echo   - API Endpoint:    http://localhost:8000/api/v1/
echo   - رسانه‌ها:         http://localhost:8000/media/
echo.

echo [مراحل بعدی]
echo 1. فایل .env را برای تنظیمات خاص محیط خود ویرایش کنید
echo 2. داکیومنت‌ها را در فایل README.md مطالعه کنید
echo 3. برای توسعه، از شاخه‌های جداگانه استفاده کنید
echo.

echo برای خروج این پنجره را ببندید یا دکمه‌ای را فشار دهید...
pause >nul
