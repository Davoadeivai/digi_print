@echo off
REM اسکریپت راه‌اندازی اولیه دیتابیس برای Windows

echo ====================================
echo راه‌اندازی دیتابیس Django
echo ====================================
echo.

REM ایجاد migrations
echo [1/4] ایجاد migrations...
python manage.py makemigrations
echo.

REM اجرای migrations
echo [2/4] اجرای migrations...
python manage.py migrate
echo.

REM ایجاد superuser
echo [3/4] ایجاد superuser...
echo لطفا اطلاعات مدیر کل را وارد کنید:
python manage.py createsuperuser
echo.

REM جمع‌آوری static files
echo [4/4] جمع‌آوری static files...
python manage.py collectstatic --noinput
echo.

echo ====================================
echo راه‌اندازی با موفقیت انجام شد!
echo ====================================
echo.
echo برای اجرای سرور دستور زیر را وارد کنید:
echo   python manage.py runserver
echo.
echo پنل ادمین در آدرس زیر در دسترس است:
echo   http://localhost:8000/admin
echo.
pause
