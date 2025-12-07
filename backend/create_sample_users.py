"""
اسکریپت ساخت کاربران نمونه برای تست پروژه
استفاده: python manage.py shell < create_sample_users.py
"""

from apps.accounts.models import CustomUser, UserProfile, Wallet
from apps.accounts.enums import UserRole

print("🚀 شروع ساخت کاربران نمونه...")

# 1. کاربر ادمین (Superuser)
admin, created = CustomUser.objects.get_or_create(
    email='admin@digichapograph.com',
    defaults={
        'first_name': 'مدیر',
        'last_name': 'سیستم',
        'phone': '09121234567',
        'role': UserRole.ADMIN,
        'is_staff': True,
        'is_superuser': True,
        'is_active': True,
        'email_verified': True,
    }
)
if created:
    admin.set_password('admin123')
    admin.save()
    # ساخت پروفایل
    UserProfile.objects.create(
        user=admin,
        bio='مدیر کل سیستم',
        job_title='مدیر فنی',
        discount_percentage=50
    )
    # ساخت کیف پول
    Wallet.objects.create(user=admin, balance=1000000)
    print(f"✅ کاربر ادمین ساخته شد: {admin.email} / رمز: admin123")
else:
    print(f"ℹ️  کاربر ادمین قبلاً وجود داشت: {admin.email}")

# 2. کاربر مدیر فروشگاه
manager, created = CustomUser.objects.get_or_create(
    email='manager@digichapograph.com',
    defaults={
        'first_name': 'رضا',
        'last_name': 'احمدی',
        'phone': '09121234568',
        'company': 'دیجی چاپوگراف',
        'role': UserRole.MANAGER,
        'is_store_admin': True,
        'is_active': True,
        'email_verified': True,
    }
)
if created:
    manager.set_password('manager123')
    manager.save()
    UserProfile.objects.create(
        user=manager,
        bio='مدیر فروشگاه',
        job_title='مدیر فروش',
        discount_percentage=30
    )
    Wallet.objects.create(user=manager, balance=500000)
    print(f"✅ کاربر مدیر ساخته شد: {manager.email} / رمز: manager123")
else:
    print(f"ℹ️  کاربر مدیر قبلاً وجود داشت: {manager.email}")

# 3. کاربر کارمند
staff, created = CustomUser.objects.get_or_create(
    email='staff@digichapograph.com',
    defaults={
        'first_name': 'سارا',
        'last_name': 'محمدی',
        'phone': '09121234569',
        'company': 'دیجی چاپوگراف',
        'role': UserRole.STAFF,
        'is_store_staff': True,
        'is_active': True,
        'email_verified': True,
    }
)
if created:
    staff.set_password('staff123')
    staff.save()
    UserProfile.objects.create(
        user=staff,
        bio='کارمند فروش',
        job_title='کارشناس فروش',
        discount_percentage=20
    )
    Wallet.objects.create(user=staff, balance=100000)
    print(f"✅ کاربر کارمند ساخته شد: {staff.email} / رمز: staff123")
else:
    print(f"ℹ️  کاربر کارمند قبلاً وجود داشت: {staff.email}")

# 4-8. کاربران مشتری نمونه
customers_data = [
    {
        'email': 'customer1@example.com',
        'first_name': 'علی',
        'last_name': 'رضایی',
        'phone': '09121111111',
        'company': 'شرکت الف',
    },
    {
        'email': 'customer2@example.com',
        'first_name': 'مریم',
        'last_name': 'کریمی',
        'phone': '09122222222',
        'company': 'شرکت ب',
    },
    {
        'email': 'customer3@example.com',
        'first_name': 'حسین',
        'last_name': 'نوری',
        'phone': '09123333333',
        'company': 'شرکت ج',
    },
    {
        'email': 'customer4@example.com',
        'first_name': 'فاطمه',
        'last_name': 'حسینی',
        'phone': '09124444444',
        'company': '',
    },
    {
        'email': 'customer5@example.com',
        'first_name': 'محمد',
        'last_name': 'عباسی',
        'phone': '09125555555',
        'company': 'شرکت د',
    },
]

for i, customer_data in enumerate(customers_data, 1):
    customer, created = CustomUser.objects.get_or_create(
        email=customer_data['email'],
        defaults={
            **customer_data,
            'role': UserRole.CUSTOMER,
            'is_active': True,
            'email_verified': True,
        }
    )
    if created:
        customer.set_password(f'customer{i}23')
        customer.save()
        UserProfile.objects.create(
            user=customer,
            bio=f'مشتری شماره {i}',
            discount_percentage=10 if i % 2 == 0 else 0
        )
        Wallet.objects.create(user=customer, balance=50000 * i)
        print(f"✅ مشتری {i} ساخته شد: {customer.email} / رمز: customer{i}23")
    else:
        print(f"ℹ️  مشتری {i} قبلاً وجود داشت: {customer.email}")

print("\n" + "="*60)
print("🎉 تمام کاربران با موفقیت ساخته شدند!")
print("="*60)
print("\n📋 لیست کاربران:")
print("-" * 60)
print(f"{'نقش':<15} {'ایمیل':<30} {'رمز عبور':<15}")
print("-" * 60)
print(f"{'ادمین':<15} {'admin@digichapograph.com':<30} {'admin123':<15}")
print(f"{'مدیر':<15} {'manager@digichapograph.com':<30} {'manager123':<15}")
print(f"{'کارمند':<15} {'staff@digichapograph.com':<30} {'staff123':<15}")
for i in range(1, 6):
    print(f"{'مشتری ' + str(i):<15} {f'customer{i}@example.com':<30} {f'customer{i}23':<15}")
print("-" * 60)
print(f"\n✅ مجموع: {CustomUser.objects.count()} کاربر")
print(f"✅ مجموع پروفایل: {UserProfile.objects.count()} پروفایل")
print(f"✅ مجموع کیف پول: {Wallet.objects.count()} کیف پول")
print("\n💡 برای ورود به Django Admin:")
print("   URL: http://localhost:8000/admin")
print("   Email: admin@digichapograph.com")
print("   Password: admin123")
