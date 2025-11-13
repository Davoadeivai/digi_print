#!/bin/bash

# اسکریپت ایجاد خودکار فایل .env
# استفاده: ./create-env.sh

echo "🔧 در حال ایجاد فایل .env..."

# ایجاد فایل .env
cat > .env << 'EOF'
# Frontend Environment Variables
VITE_API_URL=http://localhost:8000/api/v1
EOF

echo "✅ فایل .env با موفقیت ایجاد شد!"
echo ""
echo "محتوا:"
cat .env
echo ""
echo "📝 مراحل بعدی:"
echo "1. سرور را restart کنید: Ctrl+C سپس npm run dev"
echo "2. مرورگر را refresh کنید: Ctrl+Shift+R"
echo ""
echo "✨ موفق باشید!"
