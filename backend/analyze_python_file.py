import os
from pathlib import Path
import ast
import json
import re
import subprocess
import sys

# ------------------ رنگ‌ها برای لاگ ------------------
class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def log_info(msg): print(f"{Colors.CYAN}ℹ️  {msg}{Colors.RESET}")
def log_success(msg): print(f"{Colors.GREEN}✅ {msg}{Colors.RESET}")
def log_warning(msg): print(f"{Colors.YELLOW}⚠️  {msg}{Colors.RESET}")
def log_error(msg): print(f"{Colors.RED}❌ {msg}{Colors.RESET}")
def log_title(msg): print(f"\n{Colors.BOLD}{Colors.CYAN}=== {msg} ==={Colors.RESET}\n")
def log_fix(msg): print(f"{Colors.CYAN}🔧 {msg}{Colors.RESET}")

# ------------------ متغیرهای عمومی ------------------
errors = []
warnings = []
fixes = []
BASE_DIR = Path(__file__).resolve().parent

# ------------------ توابع اصلی ------------------
def run(cmd):
    try:
        subprocess.run(cmd, shell=True, check=True)
        return True
    except subprocess.CalledProcessError:
        errors.append(f"خطا در اجرای دستور: {cmd}")
        log_error(f"خطا در اجرای دستور: {cmd}")
        return False

def read_file(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return None

def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    log_fix(f"{os.path.basename(path)} اصلاح شد")
    fixes.append(f"{os.path.basename(path)} اصلاح شد")

def analyze_python_file(path):
    content = read_file(path)
    if not content:
        return
    try:
        ast.parse(content)
    except SyntaxError as e:
        errors.append(f"SyntaxError در {path}: {e}")
        log_error(f"SyntaxError در {path}: {e}")
        return

    new_content = content
    # حذف خطوط خالی پشت سر هم
    new_content = re.sub(r'\n\s*\n+', '\n', new_content)
    # حذف trailing spaces
    new_content = re.sub(r'[ \t]+$', '', new_content, flags=re.MULTILINE)

    # مرتب کردن importها
    lines = new_content.splitlines()
    imports = [l for l in lines if l.strip().startswith('import') or l.strip().startswith('from')]
    others = [l for l in lines if not (l.strip().startswith('import') or l.strip().startswith('from'))]
    sorted_imports = sorted(imports)
    new_content = '\n'.join(sorted_imports + [''] + others)

    if new_content != content:
        write_file(path, new_content)
        fixes.append(f"پاکسازی {os.path.basename(path)}")

def cleanup_code():
    log_title("آنالیز و پاکسازی کدهای پروژه")
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith(".py"):
                analyze_python_file(os.path.join(root, file))
    log_info("آنالیز خط به خط تمام فایل‌ها انجام شد")

def show_report():
    log_title("گزارش نهایی")
    print(f"خطاها: {len(errors)}")
    for e in errors: print(f"• {Colors.RED}{e}{Colors.RESET}")
    print(f"هشدارها: {len(warnings)}")
    for w in warnings: print(f"• {Colors.YELLOW}{w}{Colors.RESET}")
    print(f"رفع شده‌ها: {len(fixes)}")
    for f in fixes: print(f"• {Colors.GREEN}{f}{Colors.RESET}")
    with open("analyze_python_report.json", "w", encoding="utf-8") as f:
        json.dump({"errors": errors, "warnings": warnings, "fixes": fixes}, f, indent=2, ensure_ascii=False)
    log_info("گزارش ذخیره شد در analyze_python_report.json")

def main():
    log_title("شروع آنالیز پیشرفته فایل‌های Python")
    cleanup_code()
    show_report()
    log_success("آنالیز کامل شد ✅")

if __name__ == "__main__":
    main()
