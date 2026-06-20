# DigiPrint — Digital Print Management System | دیجی‌پرینت — سیستم مدیریت چاپ دیجیتال

[![Python](https://img.shields.io/badge/Python-58.8%25-3776ab?style=flat-square)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-32.2%25-3178c6?style=flat-square)]()
[![CSS](https://img.shields.io/badge/CSS-4.7%25-563d7c?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)]()

<en>
## Quick Tagline
A modern, scalable platform to manage digital print orders, production workflow and client-facing print services.
</en>

<fa>
## شعار کوتاه
پلتفرمی مدرن و مقیاس‌پذیر برای مدیریت سفارش‌های چاپ دیجیتال، فرآیند تولید و خدمات مشتریان چاپ.
</fa>

---

## Table of contents | فهرست مطالب
- <en>About / Overview</en> — <fa>معرفی</fa>
- <en>Features</en> — <fa>ویژگی‌ها</fa>
- <en>Tech Stack</en> — <fa>تکنولوژی‌ها</fa>
- <en>Quick Start</en> — <fa>شروع سریع</fa>
- <en>Project Structure</en> — <fa>ساختار پروژه</fa>
- <en>API Example</en> — <fa>نمونه API</fa>
- <en>Tags / Keywords</en> — <fa>تگ‌ها / کلیدواژه‌ها</fa>
- <en>Contributing</en> — <fa>مشارکت</fa>
- <en>License & Contact</en> — <fa>لایسنس و تماس</fa>

---

## <en>About / Overview</en> | <fa>معرفی</fa>
<en>
DigiPrint is designed for print shops, advertising agencies and online print services that require reliable order management, file preflight, production tracking and client dashboards. Backend powered by Python; frontend implemented in TypeScript.
</en>
<fa>
DigiPrint برای چاپخانه‌ها، آژانس‌های تبلیغاتی و سرویس‌های چاپ آنلاین طراحی شده تا مدیریت سفارش، بررسی فایل‌های قابل چاپ، پیگیری تولید و داشبورد مشتری را فراهم کند. بک‌اند با پایتون و فرانت‌اند با TypeScript نوشته شده است.
</fa>

---

## <en>Key Features</en> | <fa>ویژگی‌های کلیدی</fa>
- <en>Order lifecycle management (create → approve → queue → print → deliver)</en>
  - <fa>مدیریت چرخهٔ سفارش (ایجاد → تأیید → صف‌بندی → چاپ → تحویل)</fa>
- <en>User roles & permissions (admin, operator, client)</en>
  - <fa>نقش‌ها و مجوزها (ادمین، اپراتور، مشتری)</fa>
- <en>File upload with preflight checks (print-ready validation)</en>
  - <fa>آپلود فایل و بررسی پیش‌پرواز (اعتبارسنجی برای چاپ)</fa>
- <en>Real-time dashboard & analytics</en>
  - <fa>داشبورد و آمار لحظه‌ای</fa>
- <en>RESTful API for integrations</en>
  - <fa>API بر پایه REST برای ادغام با سیستم‌های دیگر</fa>
- <en>Responsive UI and themeable styles</en>
  - <fa>رابط واکنش‌گرا و قابلیت تم‌دهی</fa>
- <en>Security: token-based auth, secure storage</en>
  - <fa>امنیت: احراز هویت مبتنی بر توکن و ذخیرهٔ امن داده</fa>

---

## <en>Tech Stack</en> | <fa>تکنولوژی‌ها</fa>
- <en>Backend:</en> Python (Flask / FastAPI / background workers)
  - <fa>بک‌اند:</fa> پایتون (Flask / FastAPI / پردازش پس‌زمینه)
- <en>Frontend:</en> TypeScript (React / Vue / SPA)
  - <fa>فرانت‌اند:</fa> TypeScript (React / Vue / برنامهٔ تک‌صفحه‌ای)
- <en>Styling:</en> CSS / SASS / Tailwind (optional)
  - <fa>استایل:</fa> CSS / SASS / Tailwind (اختیاری)
- <en>Dev tooling:</en> Node.js, npm/yarn, Docker (optional)
  - <fa>ابزار توسعه:</fa> Node.js، npm/yarn، Docker (اختیاری)

Repository language composition (approx):
- Python: 58.8% | TypeScript: 32.2% | CSS: 4.7%

---

## <en>Quick Start</en> | <fa>شروع سریع</fa>

<en>
Prereqs: Python 3.8+, Node.js 14+, npm/yarn. Adjust commands to your chosen framework/entrypoint.
</en>

<fa>
پیش‌نیازها: Python 3.8+، Node.js 14+، npm یا yarn. دستورات زیر را بسته به نقطه ورود پروژه تنظیم کنید.
</fa>

```bash
# Clone
git clone https://github.com/Davoadeivai/digi_print.git
cd digi_print

# Backend (example)
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export FLASK_APP=backend.app  # یا تنظیم مناسب برای پروژه
flask run

# Frontend (example)
cd frontend
npm install
npm run dev
```

---

## <en>Project Structure</en> | <fa>ساختار پروژه</fa>
```
digi_print/
├── backend/        # Python services, API, workers
├── frontend/       # TypeScript SPA
├── styles/         # CSS/SASS
├── docs/           # Documentation & API specs
├── tests/          # Unit & integration tests
└── scripts/        # Dev/automation scripts
```

---

## <en>API Example</en> | <fa>نمونه API</fa>

<en>
Example TypeScript usage:
</en>

<fa>
نمونه استفاده در TypeScript:
</fa>

```ts
// example
const order = await api.createOrder({
  title: "Brochure Print",
  quantity: 500,
  specs: { color: "CMYK", sides: "double" }
});
```

---

## <en>Tags / Keywords</en> | <fa>تگ‌ها / کلیدواژه‌ها</fa>

<en>
Recommended GitHub topics:
- python
- typescript
- react
- flask
- fastapi
- docker
- printing
- print-management
- rest-api
- saas
</en>

<fa>
تگ‌های پیشنهادی برای Fiverr (فارسی + انگلیسی) و Keywords برای جستجو:
- چاپ دیجیتال — Digital Printing
- مدیریت سفارش چاپ — Print Order Management
- پرینت بروشور — Brochure Printing
- اتوماسیون چاپ — Print Automation
- طراحی فایل چاپی — Print File Preparation
- ادغام API — API Integration
- پیاده‌سازی و استقرار — Setup & Deployment
</fa>

---

## <en>Suggested Fiverr Gig Title & Tags</en> | <fa>عنوان و تگ‌های پیشنهادی برای Fiverr</fa>
<en>
Title suggestions:
- "I will build and customize your DigiPrint order management system"
- "Setup & deploy digital print management solution (Python + TypeScript)"

Fiverr tags (recommended):
- digital printing, print management, python, typescript, rest api, react, docker, automation, prepress, printshop
</en>

<fa>
عناوین پیشنهادی:
- «راه‌اندازی و سفارشی‌سازی سیستم مدیریت چاپ دیجیتال DigiPrint»
- «نصب، پیکربندی و استقرار سامانه چاپ (Python + TypeScript)"

تگ‌های پیشنهادی فارسی/انگلیسی:
- چاپ دیجیتال, مدیریت سفارش, Python, TypeScript, API, استقرار, اتوماسیون, طراحی آماده چاپ
</fa>

---

## <en>Contributing</en> | <fa>مشارکت</fa>
<en>
Fork → Branch → Commit → PR. Please follow code style and add tests for new features.
</en>

<fa>
اول Fork کنید → شاخه بسازید → تغییرات را Commit کنید → Pull Request ارسال کنید. لطفاً قوانین کدنویسی و تست‌ها را رعایت کنید.
</fa>

---

## <en>License & Contact</en> | <fa>لایسنس و تماس</fa>
<en>
MIT License. Author: Davoadeivai — https://github.com/Davoadeivai
</en>

<fa>
لایسنس: MIT. نویسنده: Davoadeivai — https://github.com/Davoadeivai
</fa>

_Last updated: 2026-06-20_
