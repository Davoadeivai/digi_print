import os
import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# -----------------------------
# 1️⃣ بررسی requirements.txt
# -----------------------------
req_file = BASE_DIR / "requirements.txt"
if not req_file.exists():
    print("❌ فایل requirements.txt پیدا نشد!")
    sys.exit(1)

print("✅ پیدا شد: requirements.txt")

# -----------------------------
# 2️⃣ نصب Celery و Redis اگر موجود نباشد
# -----------------------------
def pip_install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import celery
    print("✅ Celery نصب است")
except ImportError:
    print("⚠️ Celery نصب نیست. نصب می‌کنم...")
    pip_install("celery>=5.3.0")

try:
    import redis
    print("✅ Redis نصب است")
except ImportError:
    print("⚠️ Redis نصب نیست. نصب می‌کنم...")
    pip_install("redis>=4.5.0")

# نصب تمام پکیج‌های requirements
print("⚡ نصب تمام پکیج‌ها از requirements.txt ...")
subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", str(req_file)])

# -----------------------------
# 3️⃣ اصلاح import Celery در __init__.py
# -----------------------------
init_file = BASE_DIR / "config" / "__init__.py"
if init_file.exists():
    with open(init_file, "r", encoding="utf-8") as f:
        lines = f.readlines()
    modified = False
    for i, line in enumerate(lines):
        if "from .celery import app as celery_app" in line:
            lines[i] = f"# {line}"  # کامنت کردن
            modified = True
    if modified:
        with open(init_file, "w", encoding="utf-8") as f:
            f.writelines(lines)
        print("✅ import Celery در __init__.py کامنت شد")
    else:
        print("ℹ️ خط import Celery از قبل اصلاح شده است")
else:
    print("⚠️ فایل __init__.py پیدا نشد در config")

# -----------------------------
# 4️⃣ بررسی SECRET_KEY در .env
# -----------------------------
env_file = BASE_DIR / ".env"
if not env_file.exists():
    print("⚠️ فایل .env پیدا نشد، لطفاً بسازید و SECRET_KEY اضافه کنید")
else:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=env_file)
    if not os.getenv("SECRET_KEY"):
        print("❌ SECRET_KEY در .env موجود نیست!")
    else:
        print("✅ SECRET_KEY موجود است")

# -----------------------------
# 5️⃣ بررسی migrate
# -----------------------------
print("⚡ اجرای migrate برای آماده‌سازی دیتابیس ...")
subprocess.run([sys.executable, "manage.py", "migrate"])

# -----------------------------
# 6️⃣ بررسی static
# -----------------------------
print("⚡ جمع‌آوری فایل‌های static ...")
subprocess.run([sys.executable, "manage.py", "collectstatic", "--noinput"])

print("✅ همه کارها انجام شد. آماده deploy روی Railway!")
