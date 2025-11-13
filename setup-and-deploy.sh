#!/bin/bash

# رنگ‌های ترمینال
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 در حال آنالیز پروژه...${NC}"

# بررسی وجود Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git نصب نیست. لطفا Git را نصب کنید.${NC}"
    echo -e "   دستور نصب در لینوکس: ${YELLOW}sudo apt-get install git${NC}"
    echo -e "   دانلود برای ویندوز: ${YELLOW}https://git-scm.com/download/win${NC}"
    exit 1
fi

# بررسی وجود Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js نصب نیست. لطفا Node.js را نصب کنید.${NC}"
    echo -e "   دانلود: ${YELLOW}https://nodejs.org/${NC}"
    exit 1
fi

# بررسی نسخه Node.js
echo -e "${GREEN}✅ Node.js نصب شده است${NC} ($(node -v))"

# بررسی وجود Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI نصب نیست. در حال نصب...${NC}"
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ خطا در نصب Vercel CLI${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Vercel CLI با موفقیت نصب شد${NC}"
fi

# مقداردهی اولیه Git
if [ ! -d ".git" ]; then
    echo -e "\n${BLUE}🚀 در حال مقداردهی اولیه Git...${NC}"
    git init
    
    # تنظیم اطلاعات کاربر
    read -p "آدرس ایمیل Git خود را وارد کنید: " git_email
    read -p "نام کاربری Git خود را وارد کنید: " git_username
    
    git config --local user.email "$git_email"
    git config --local user.name "$git_username"
    
    echo -e "${GREEN}✅ Git با موفقیت پیکربندی شد${NC}"
fi

# نصب وابستگی‌ها
echo -e "\n${BLUE}📦 در حال نصب وابستگی‌های پروژه...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ خطا در نصب وابستگی‌ها${NC}"
    exit 1
fi

# ساخت نسخه تولیدی
echo -e "\n${BLUE}🔨 در حال ساخت نسخه تولیدی...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ خطا در ساخت نسخه تولیدی${NC}"
    exit 1
fi

# اضافه کردن فایل‌ها به Git
echo -e "\n${BLUE}💾 در حال ذخیره تغییرات در Git...${NC}"
git add .

echo -e "\n${BLUE}📝 پیام کامیت را وارد کنید (به عنوان مثال: 'اولین کامیت'):${NC}"
read commit_message
if [ -z "$commit_message" ]; then
    commit_message="اولین کامیت"
fi

git commit -m "$commit_message"

# پیکربندی ریموت
echo -e "\n${BLUE}🌐 پیکربندی مخزن ریموت Git...${NC}"
read -p "آیا می‌خواهید یک مخزن ریموت اضافه کنید؟ (y/n): " add_remote

if [[ $add_remote =~ ^[Yy]$ ]]; then
    read -p "آدرس مخزن Git را وارد کنید (مانند: https://github.com/username/repo.git): " repo_url
    if [ -n "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo -e "${GREEN}✅ مخزن ریموت اضافه شد${NC}"
        
        # Push به مخزن ریموت
        echo -e "\n${BLUE}🔄 در حال ارسال تغییرات به مخزن ریموت...${NC}"
        git push -u origin main || git push -u origin master
    fi
fi

# دیپلوی روی Vercel
echo -e "\n${BLUE}🚀 در حال دیپلوی روی Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}🎉 پروژه با موفقیت دیپلوی شد!${NC}"
    echo -e "\n${YELLOW}📌 نکات مهم:"
    echo -e "- فایل‌های حساس مانند .env را به .gitignore اضافه کنید"
    echo -e "- برای به‌روزرسانی پروژه، کافیست تغییرات را به Git اضافه و Push کنید"
    echo -e "- برای مدیریت دامنه و تنظیمات بیشتر به پنل Vercel مراجعه کنید${NC}"
else
    echo -e "\n${YELLOW}⚠️  برای دیپلوی دستی، دستور زیر را اجرا کنید:"
    echo -e "vercel --prod${NC}"
fi
