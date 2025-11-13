@echo off
REM اسکریپت ایجاد خودکار فایل .env برای Windows
REM استفاده: create-env.bat

echo 🔧 در حال ایجاد فایل .env...
echo.

REM ایجاد فایل .env
(
echo # Frontend Environment Variables
echo VITE_API_URL=http://localhost:8000/api/v1
) > .env

echo ✅ فایل .env با موفقیت ایجاد شد!
echo.
echo محتوا:
type .env
echo.
echo 📝 مراحل بعدی:
echo 1. سرور را restart کنید: Ctrl+C سپس npm run dev
echo 2. مرورگر را refresh کنید: Ctrl+Shift+R
echo.
echo ✨ موفق باشید!
pause
