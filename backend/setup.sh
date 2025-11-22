#!/bin/bash
# ====================================
# اسکریپت راه‌اندازی خودکار Django Backend
# ====================================

echo "🚀 شروع راه‌اندازی بک‌اند Django..."

# رنگ‌ها برای خروجی
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# تابع برای چاپ پیام موفقیت
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# تابع برای چاپ هشدار
warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# تابع برای چاپ خطا
error() {
    echo -e "${RED}✗ $1${NC}"
}

# بررسی وجود Python
if ! command -v python3 &> /dev/null; then
    error "Python 3 نصب نیست. لطفا ابتدا Python 3 را نصب کنید."
    exit 1
fi
success "Python 3 یافت شد"

# ایجاد محیط مجازی
echo ""
echo "📦 ایجاد محیط مجازی..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    success "محیط مجازی ایجاد شد"
else
    warning "محیط مجازی قبلا ایجاد شده است"
fi

# فعال‌سازی محیط مجازی
echo ""
echo "🔧 فعال‌سازی محیط مجازی..."
source venv/bin/activate
success "محیط مجازی فعال شد"

# ارتقای pip
echo ""
echo "⬆️  ارتقای pip..."
pip install --upgrade pip > /dev/null 2>&1
success "pip به‌روزرسانی شد"

# نصب پکیج‌ها
echo ""
echo "📥 نصب پکیج‌های مورد نیاز..."
pip install -r requirements.txt
if [ $? -eq 0 ]; then
    success "پکیج‌ها با موفقیت نصب شدند"
else
    error "خطا در نصب پکیج‌ها"
    exit 1
fi

# کپی فایل .env
echo ""
if [ ! -f ".env" ]; then
    echo "📋 ایجاد فایل .env..."
    cp .env.example .env
    success "فایل .env ایجاد شد"
    warning "لطفا فایل .env را ویرایش کرده و مقادیر مورد نیاز را وارد کنید"
else
    warning "فایل .env قبلا وجود دارد"
fi

# ایجاد پوشه‌های media و static
echo ""
echo "📁 ایجاد پوشه‌های ضروری..."
mkdir -p media/services media/portfolio media/uploads static staticfiles
success "پوشه‌ها ایجاد شدند"

# مهاجرت دیتابیس
echo ""
echo "🗄️  مهاجرت دیتابیس..."
python manage.py makemigrations
python manage.py migrate
if [ $? -eq 0 ]; then
    success "مهاجرت دیتابیس انجام شد"
else
    error "خطا در مهاجرت دیتابیس"
    exit 1
fi

# جمع‌آوری فایل‌های استاتیک
echo ""
echo "📦 جمع‌آوری فایل‌های استاتیک..."
python manage.py collectstatic --noinput > /dev/null 2>&1
success "فایل‌های استاتیک جمع‌آوری شدند"

# ایجاد سوپریوزر (اختیاری)
echo ""
read -p "آیا می‌خواهید سوپریوزر ایجاد کنید؟ (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

# پایان
echo ""
echo "======================================"
success "راه‌اندازی با موفقیت انجام شد! 🎉"
echo "======================================"
echo ""
echo "برای اجرای سرور دستور زیر را وارد کنید:"
echo "  python manage.py runserver"
echo ""
echo "آدرس‌های مهم:"
echo "  API: http://localhost:8000/api/v1/"
echo "  Admin: http://localhost:8000/admin/"
echo "  Swagger: http://localhost:8000/api/docs/"
echo ""
