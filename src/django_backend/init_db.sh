#!/bin/bash
# اسکریپت راه‌اندازی اولیه دیتابیس

echo "🚀 راه‌اندازی دیتابیس Django..."
echo ""

# رنگ‌ها برای output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ایجاد migrations
echo -e "${YELLOW}📝 ایجاد migrations...${NC}"
python manage.py makemigrations
echo ""

# اجرای migrations
echo -e "${YELLOW}🔄 اجرای migrations...${NC}"
python manage.py migrate
echo ""

# ایجاد superuser
echo -e "${YELLOW}👤 ایجاد superuser...${NC}"
echo "لطفا اطلاعات مدیر کل را وارد کنید:"
python manage.py createsuperuser
echo ""

# جمع‌آوری static files
echo -e "${YELLOW}📦 جمع‌آوری static files...${NC}"
python manage.py collectstatic --noinput
echo ""

echo -e "${GREEN}✅ راه‌اندازی با موفقیت انجام شد!${NC}"
echo ""
echo "برای اجرای سرور دستور زیر را وارد کنید:"
echo "  python manage.py runserver"
echo ""
echo "پنل ادمین در آدرس زیر در دسترس است:"
echo "  http://localhost:8000/admin"
echo ""
