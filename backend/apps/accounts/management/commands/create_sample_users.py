"""
Django Management Command: ساخت کاربران نمونه
استفاده: python manage.py create_sample_users
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from apps.accounts.models import CustomUser, UserProfile, Wallet
from apps.accounts.enums import UserRole


class Command(BaseCommand):
    help = 'ساخت کاربران نمونه برای تست پروژه'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('شروع ساخت کاربران نمونه...'))
        
        with transaction.atomic():
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
                UserProfile.objects.get_or_create(
                    user=admin,
                    defaults={
                        'bio': 'مدیر کل سیستم',
                        'job_title': 'مدیر فنی',
                        'discount_percentage': 50
                    }
                )
                Wallet.objects.get_or_create(user=admin, defaults={'balance': 1000000})
                self.stdout.write(self.style.SUCCESS(f'[OK] کاربر ادمین: {admin.email} / رمز: admin123'))
            else:
                self.stdout.write(self.style.WARNING(f'[INFO] کاربر ادمین قبلاً وجود داشت: {admin.email}'))

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
                UserProfile.objects.get_or_create(
                    user=manager,
                    defaults={
                        'bio': 'مدیر فروشگاه',
                        'job_title': 'مدیر فروش',
                        'discount_percentage': 30
                    }
                )
                Wallet.objects.get_or_create(user=manager, defaults={'balance': 500000})
                self.stdout.write(self.style.SUCCESS(f'[OK] کاربر مدیر: {manager.email} / رمز: manager123'))
            else:
                self.stdout.write(self.style.WARNING(f'[INFO] کاربر مدیر قبلاً وجود داشت: {manager.email}'))

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
                UserProfile.objects.get_or_create(
                    user=staff,
                    defaults={
                        'bio': 'کارمند فروش',
                        'job_title': 'کارشناس فروش',
                        'discount_percentage': 20
                    }
                )
                Wallet.objects.get_or_create(user=staff, defaults={'balance': 100000})
                self.stdout.write(self.style.SUCCESS(f'[OK] کاربر کارمند: {staff.email} / رمز: staff123'))
            else:
                self.stdout.write(self.style.WARNING(f'[INFO] کاربر کارمند قبلاً وجود داشت: {staff.email}'))

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
                    UserProfile.objects.get_or_create(
                        user=customer,
                        defaults={
                            'bio': f'مشتری شماره {i}',
                            'discount_percentage': 10 if i % 2 == 0 else 0
                        }
                    )
                    Wallet.objects.get_or_create(user=customer, defaults={'balance': 50000 * i})
                    self.stdout.write(self.style.SUCCESS(f'[OK] مشتری {i}: {customer.email} / رمز: customer{i}23'))
                else:
                    self.stdout.write(self.style.WARNING(f'[INFO] مشتری {i} قبلاً وجود داشت: {customer.email}'))

        # خلاصه نهایی
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('[SUCCESS] تمام کاربران با موفقیت ساخته شدند!'))
        self.stdout.write(self.style.SUCCESS('='*60))
        
        self.stdout.write('\n[INFO] لیست کاربران:')
        self.stdout.write('-' * 60)
        self.stdout.write(f"{'نقش':<15} {'ایمیل':<30} {'رمز عبور':<15}")
        self.stdout.write('-' * 60)
        self.stdout.write(f"{'ادمین':<15} {'admin@digichapograph.com':<30} {'admin123':<15}")
        self.stdout.write(f"{'مدیر':<15} {'manager@digichapograph.com':<30} {'manager123':<15}")
        self.stdout.write(f"{'کارمند':<15} {'staff@digichapograph.com':<30} {'staff123':<15}")
        for i in range(1, 6):
            self.stdout.write(f"{'مشتری ' + str(i):<15} {f'customer{i}@example.com':<30} {f'customer{i}23':<15}")
        self.stdout.write('-' * 60)
        
        total_users = CustomUser.objects.count()
        total_profiles = UserProfile.objects.count()
        total_wallets = Wallet.objects.count()
        
        self.stdout.write(f'\n[OK] مجموع: {total_users} کاربر')
        self.stdout.write(f'[OK] مجموع پروفایل: {total_profiles} پروفایل')
        self.stdout.write(f'[OK] مجموع کیف پول: {total_wallets} کیف پول')
        
        self.stdout.write(self.style.SUCCESS('\n[INFO] برای ورود به Django Admin:'))
        self.stdout.write('   URL: http://localhost:8000/admin')
        self.stdout.write('   Email: admin@digichapograph.com')
        self.stdout.write('   Password: admin123')
