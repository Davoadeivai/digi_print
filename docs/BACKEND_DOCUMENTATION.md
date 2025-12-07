# 📚 مستندات کامل Backend - پروژه دیجی چاپ و گرافیک

## 📋 فهرست مطالب
- [معماری کلی](#معماری-کلی)
- [فایل‌های تنظیمات](#فایل‌های-تنظیمات)
- [اپلیکیشن Accounts](#اپلیکیشن-accounts)
- [اپلیکیشن Products](#اپلیکیشن-products)
- [اپلیکیشن Core](#اپلیکیشن-core)
- [API Endpoints](#api-endpoints)

---

## 🏗️ معماری کلی

پروژه Backend با استفاده از **Django 5.0.1** و **Django REST Framework** ساخته شده است.

### ساختار کلی پروژه
```
backend/
├── config/              # تنظیمات اصلی Django
├── apps/               # اپلیکیشن‌های Django
│   ├── accounts/       # مدیریت کاربران و احراز هویت
│   ├── products/       # مدیریت محصولات و سفارشات
│   └── core/          # عملکردهای مشترک
├── templates/         # قالب‌های HTML
├── staticfiles/       # فایل‌های استاتیک
└── manage.py         # فایل مدیریت Django
```

---

## ⚙️ فایل‌های تنظیمات

### 📄 `config/settings.py`
**مسیر**: `backend/config/settings.py`  
**خطوط**: 1-233  
**وظیفه**: تنظیمات اصلی پروژه Django

#### بخش‌های کلیدی:

##### 1. تنظیمات امنیتی (خطوط 29-47)
```python
SECRET_KEY = get_env_variable('SECRET_KEY', 'change-me-for-production')
DEBUG = get_env_variable('DEBUG', 'False').lower() == 'true'
ALLOWED_HOSTS = get_env_variable('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
```
- **وظیفه**: مدیریت کلید مخفی، حالت دیباگ و هاست‌های مجاز
- **استفاده**: امنیت و کنترل دسترسی به سرور

##### 2. اپلیکیشن‌های نصب شده (خطوط 64-84)
```python
INSTALLED_APPS = [
    # Django Apps
    'django.contrib.admin',
    'django.contrib.auth',
    # ...
    
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    
    # Local Apps
    'apps.accounts',
    'apps.core',
    'apps.products',
]
```
- **وظیفه**: تعریف تمام اپلیکیشن‌های فعال در پروژه
- **استفاده**: Django از این لیست برای بارگذاری ماژول‌ها استفاده می‌کند

##### 3. تنظیمات دیتابیس (خطوط 121-132)
```python
DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=True)
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
```
- **وظیفه**: تنظیم اتصال به دیتابیس (PostgreSQL در production، SQLite در development)
- **استفاده**: ذخیره‌سازی داده‌های پروژه

##### 4. تنظیمات REST Framework (خطوط 166-182)
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework_simplejwt.authentication.JWTAuthentication'],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```
- **وظیفه**: تنظیمات API، احراز هویت JWT، صفحه‌بندی
- **استفاده**: مدیریت درخواست‌های API

##### 5. تنظیمات CORS (خطوط 203-220)
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True
```
- **وظیفه**: مدیریت دسترسی Cross-Origin برای ارتباط با Frontend
- **استفاده**: امکان ارتباط بین Frontend و Backend

---

### 📄 `config/urls.py`
**مسیر**: `backend/config/urls.py`  
**وظیفه**: مسیریابی اصلی پروژه

#### ساختار URL ها:
- `/admin/` - پنل مدیریت Django
- `/api/v1/accounts/` - API های مربوط به کاربران
- `/api/v1/products/` - API های مربوط به محصولات
- `/api/health/` - بررسی سلامت سرور

---

### 📄 `config/wsgi.py` و `config/asgi.py`
**وظیفه**: نقطه ورود برای سرورهای WSGI/ASGI در production

---

## 👥 اپلیکیشن Accounts

### 📄 `apps/accounts/models.py`
**مسیر**: `backend/apps/accounts/models.py`  
**خطوط**: 1-174  
**وظیفه**: تعریف مدل‌های مربوط به کاربران

#### 1. مدل CustomUser (خطوط 9-117)
```python
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('ایمیل'), unique=True)
    first_name = models.CharField(_('نام'), max_length=150, blank=True)
    last_name = models.CharField(_('نام خانوادگی'), max_length=150, blank=True)
    phone = models.CharField(_('شماره تلفن'), max_length=20, blank=True)
    company = models.CharField(_('شرکت'), max_length=200, blank=True)
    role = models.CharField(_('نقش'), max_length=50, choices=UserRole.choices, default=UserRole.CUSTOMER)
```

**فیلدهای کلیدی**:
- `email` (خط 14): ایمیل منحصر به فرد کاربر - استفاده به عنوان username
- `role` (خطوط 21-26): نقش کاربر (مشتری، ادمین، کارمند)
- `is_store_admin` (خط 29): آیا کاربر مدیر فروشگاه است
- `avatar` (خط 38): تصویر پروفایل کاربر

**متدهای مهم**:
- `get_full_name()` (خطوط 62-66): بازگرداندن نام کامل کاربر
- `total_order_count()` (خطوط 83-87): شمارش تعداد کل سفارشات
- `has_permission_for_role()` (خطوط 111-116): بررسی دسترسی بر اساس نقش

#### 2. مدل UserProfile (خطوط 118-136)
```python
class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(_('بیوگرافی'), blank=True)
    avatar = models.ImageField(_('آواتار'), upload_to='avatars/', null=True, blank=True)
    job_title = models.CharField(_('سمت شغلی'), max_length=150, blank=True)
    discount_percentage = models.PositiveIntegerField(_('درصد تخفیف'), default=0)
    total_orders = models.PositiveIntegerField(_('تعداد سفارشات'), default=0)
    total_spent = models.PositiveIntegerField(_('مجموع خرید'), default=0)
```

**وظیفه**: ذخیره اطلاعات تکمیلی پروفایل کاربر  
**رابطه**: One-to-One با CustomUser

#### 3. مدل UserAddress (خطوط 138-153)
```python
class UserAddress(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='addresses')
    title = models.CharField(_('عنوان'), max_length=150)
    full_name = models.CharField(_('نام و نام خانوادگی'), max_length=150)
    phone = models.CharField(_('شماره تلفن'), max_length=20)
    province = models.CharField(_('استان'), max_length=100, blank=True)
    city = models.CharField(_('شهر'), max_length=100, blank=True)
    address = models.TextField(_('آدرس'), blank=True)
    postal_code = models.CharField(_('کدپستی'), max_length=20, blank=True)
    is_default = models.BooleanField(_('پیش‌فرض'), default=False)
```

**وظیفه**: ذخیره آدرس‌های کاربر  
**رابطه**: Many-to-One با UserProfile

#### 4. مدل UserActivity (خطوط 155-174)
```python
class UserActivity(models.Model):
    ACTIVITY_TYPES = [
        ('login', 'ورود'),
        ('logout', 'خروج'),
        ('password_change', 'تغییر رمز عبور'),
        ('profile_update', 'ویرایش پروفایل'),
        ('order_create', 'سفارش جدید'),
        ('order_cancel', 'لغو سفارش'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(_('نوع فعالیت'), max_length=50, choices=ACTIVITY_TYPES)
    description = models.TextField(_('توضیحات'), blank=True)
    ip_address = models.GenericIPAddressField(_('آی‌پی'), blank=True, null=True)
    user_agent = models.TextField(_('User Agent'), blank=True)
```

**وظیفه**: ثبت فعالیت‌های کاربر برای امنیت و گزارش‌گیری

---

### 📄 `apps/accounts/views.py`
**مسیر**: `backend/apps/accounts/views.py`  
**خطوط**: 1-252  
**وظیفه**: مدیریت درخواست‌های API مربوط به کاربران

#### 1. UserRegistrationView (خطوط 27-99)
```python
class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer
```

**متد GET** (خطوط 46-67):
- **وظیفه**: نمایش فیلدهای مورد نیاز برای ثبت‌نام
- **خروجی**: لیست فیلدها با نوع، الزامی بودن و توضیحات

**متد POST** (خطوط 69-99):
- **وظیفه**: ثبت کاربر جدید
- **ورودی**: email, password, first_name, last_name
- **خروجی**: اطلاعات کاربر + JWT tokens
- **خطوط کلیدی**: 
  - 76-77: ایجاد کاربر و توکن JWT
  - 78-86: بازگرداندن پاسخ موفق

#### 2. UserLoginView (خطوط 104-116)
```python
class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
```

**متد POST**:
- **وظیفه**: ورود کاربر و دریافت توکن
- **ورودی**: email, password
- **خروجی**: JWT access و refresh tokens

#### 3. UserProfileView (خطوط 136-142)
```python
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
```

**وظیفه**: نمایش و ویرایش پروفایل کاربر  
**دسترسی**: فقط کاربران احراز هویت شده

#### 4. UserAddressListCreateView (خطوط 168-181)
```python
class UserAddressListCreateView(generics.ListCreateAPIView):
    serializer_class = UserAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
```

**وظیفه**: لیست و ایجاد آدرس‌های کاربر  
**متدها**: GET (لیست آدرس‌ها), POST (ایجاد آدرس جدید)

#### 5. UserActivityListView (خطوط 197-202)
```python
class UserActivityListView(generics.ListAPIView):
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
```

**وظیفه**: نمایش فعالیت‌های کاربر

---

### 📄 `apps/accounts/serializers.py`
**وظیفه**: تبدیل داده‌های مدل به JSON و اعتبارسنجی

**Serializers اصلی**:
- `UserRegistrationSerializer`: اعتبارسنجی ثبت‌نام
- `UserLoginSerializer`: اعتبارسنجی ورود
- `UserProfileSerializer`: سریالایز پروفایل کاربر
- `UserAddressSerializer`: سریالایز آدرس‌ها
- `ChangePasswordSerializer`: تغییر رمز عبور

---

### 📄 `apps/accounts/urls.py`
**وظیفه**: مسیریابی API های accounts

**مسیرها**:
- `POST /register/` - ثبت‌نام
- `POST /login/` - ورود
- `POST /logout/` - خروج
- `GET/PUT /profile/` - پروفایل کاربر
- `GET/POST /addresses/` - آدرس‌ها
- `GET /activities/` - فعالیت‌ها

---

## 🛍️ اپلیکیشن Products

### 📄 `apps/products/models.py`
**مسیر**: `backend/apps/products/models.py`  
**خطوط**: 1-329  
**وظیفه**: تعریف مدل‌های محصولات و سفارشات

#### 1. مدل ProductCategory (خطوط 8-31)
```python
class ProductCategory(models.Model):
    name = models.CharField('نام دسته‌بندی', max_length=100)
    slug = models.SlugField('اسلاگ', max_length=120, unique=True)
    description = models.TextField('توضیحات', blank=True)
    image = models.ImageField('تصویر', upload_to='categories/', null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
```

**وظیفه**: دسته‌بندی محصولات (لیبل، جعبه، کارت ویزیت و...)  
**ویژگی**: پشتیبانی از دسته‌بندی چند سطحی با فیلد `parent`

#### 2. مدل Product (خطوط 33-119)
```python
class Product(models.Model):
    PRINT_TYPES = [
        ('digital', 'چاپ دیجیتال'),
        ('offset', 'چاپ افست'),
        ('both', 'هر دو'),
    ]
    
    name = models.CharField('نام محصول', max_length=200)
    slug = models.SlugField('اسلاگ', max_length=220, unique=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')
    description = models.TextField('توضیحات کامل')
    image = models.ImageField('تصویر اصلی', upload_to='products/')
    
    # مشخصات چاپ
    print_type = models.CharField('نوع چاپ', max_length=10, choices=PRINT_TYPES, default='digital')
    min_quantity = models.PositiveIntegerField('حداقل تیراژ', default=1)
    max_quantity = models.PositiveIntegerField('حداکثر تیراژ', default=10000)
    delivery_time_hours = models.PositiveIntegerField('زمان تحویل (ساعت)', default=24)
    
    # قیمت‌گذاری
    base_price = models.DecimalField('قیمت پایه', max_digits=10, decimal_places=0)
    price_per_extra = models.DecimalField('قیمت هر واحد اضافی', max_digits=10, decimal_places=0, null=True, blank=True)
```

**متد مهم**: `get_calculated_price()` (خطوط 86-119)
- **وظیفه**: محاسبه قیمت بر اساس تعداد و ویژگی‌های اضافی
- **پارامترها**: quantity, include_design, lamination, uv_coating, paper_type
- **خروجی**: قیمت نهایی محاسبه شده

#### 3. مدل PaperType (خطوط 122-142)
```python
class PaperType(models.Model):
    name = models.CharField('نام کاغذ', max_length=100)
    gram_weight = models.PositiveIntegerField('گرماژ')
    price_per_sheet = models.DecimalField('قیمت هر برگ', max_digits=8, decimal_places=0)
    is_fancy = models.BooleanField('کاغذ فانتزی', default=False)
    texture = models.CharField('بافت', max_length=100, blank=True)
```

**وظیفه**: تعریف انواع کاغذ قابل استفاده در محصولات

#### 4. مدل Order (خطوط 191-256)
```python
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'در انتظار بررسی'),
        ('confirmed', 'تأیید شده'),
        ('in_progress', 'در حال انجام'),
        ('ready', 'آماده تحویل'),
        ('delivered', 'تحویل داده شده'),
        ('cancelled', 'لغو شده'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField('شماره سفارش', max_length=20, unique=True)
    status = models.CharField('وضعیت', max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # اطلاعات تماس
    contact_name = models.CharField('نام تماس', max_length=100)
    contact_phone = models.CharField('تلفن تماس', max_length=20)
    
    # مالی
    subtotal = models.DecimalField('جمع کل', max_digits=12, decimal_places=0)
    discount_amount = models.DecimalField('تخفیف', max_digits=10, decimal_places=0, default=0)
    delivery_cost = models.DecimalField('هزینه ارسال', max_digits=8, decimal_places=0, default=0)
    total_amount = models.DecimalField('مبلغ نهایی', max_digits=12, decimal_places=0)
```

**متد save** (خطوط 247-256):
- **وظیفه**: ایجاد شماره سفارش منحصر به فرد و محاسبه مبلغ نهایی
- **خط 250-251**: تولید شماره سفارش با UUID
- **خط 254**: محاسبه مبلغ نهایی = جمع کل - تخفیف + هزینه ارسال

#### 5. مدل OrderItem (خطوط 259-290)
```python
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField('تعداد')
    unit_price = models.DecimalField('قیمت واحد', max_digits=8, decimal_places=0)
    total_price = models.DecimalField('قیمت کل', max_digits=10, decimal_places=0)
    
    # مشخصات فنی
    paper_type = models.ForeignKey(PaperType, on_delete=models.SET_NULL, null=True, blank=True)
    size_width = models.DecimalField('عرض (سانتی‌متر)', max_digits=6, decimal_places=2)
    size_height = models.DecimalField('ارتفاع (سانتی‌متر)', max_digits=6, decimal_places=2)
    has_lamination = models.BooleanField('لمینت', default=False)
    has_uv_coating = models.BooleanField('پوشش UV', default=False)
    include_design = models.BooleanField('شامل طراحی', default=False)
```

**وظیفه**: ذخیره جزئیات هر آیتم در سفارش

---

### 📄 `apps/products/views.py`
**وظیفه**: مدیریت API های محصولات و سفارشات

**Views اصلی**:
- `ProductListView`: لیست محصولات با فیلتر و جستجو
- `ProductDetailView`: جزئیات یک محصول
- `OrderCreateView`: ایجاد سفارش جدید
- `OrderListView`: لیست سفارشات کاربر
- `CategoryListView`: لیست دسته‌بندی‌ها

---

## 🔧 اپلیکیشن Core

### 📄 `apps/core/middleware.py`
**وظیفه**: Middleware های سفارشی

**RequestLoggingMiddleware**:
- **وظیفه**: ثبت تمام درخواست‌های HTTP
- **استفاده**: دیباگ و مانیتورینگ

### 📄 `apps/core/validators.py`
**وظیفه**: اعتبارسنج‌های سفارشی برای فیلدها

---

## 🌐 API Endpoints

### Accounts API
```
POST   /api/v1/accounts/register/          # ثبت‌نام کاربر جدید
POST   /api/v1/accounts/login/             # ورود کاربر
POST   /api/v1/accounts/logout/            # خروج کاربر
GET    /api/v1/accounts/profile/           # دریافت پروفایل
PUT    /api/v1/accounts/profile/           # ویرایش پروفایل
POST   /api/v1/accounts/change-password/   # تغییر رمز عبور
GET    /api/v1/accounts/addresses/         # لیست آدرس‌ها
POST   /api/v1/accounts/addresses/         # ایجاد آدرس جدید
GET    /api/v1/accounts/activities/        # فعالیت‌های کاربر
```

### Products API
```
GET    /api/v1/products/                   # لیست محصولات
GET    /api/v1/products/{slug}/            # جزئیات محصول
GET    /api/v1/products/categories/        # لیست دسته‌بندی‌ها
POST   /api/v1/products/orders/            # ایجاد سفارش
GET    /api/v1/products/orders/            # لیست سفارشات
GET    /api/v1/products/orders/{id}/       # جزئیات سفارش
```

---

## 📊 خلاصه آمار Backend

- **تعداد کل فایل‌های Python**: 41 فایل
- **تعداد Models**: 10 مدل اصلی
- **تعداد Views**: 15+ ویو
- **تعداد API Endpoints**: 20+ endpoint
- **اپلیکیشن‌ها**: 3 اپلیکیشن (accounts, products, core)

---

## 🔐 امنیت

- **احراز هویت**: JWT (JSON Web Tokens)
- **مجوزها**: Role-based permissions
- **CORS**: تنظیم شده برای Frontend
- **HTTPS**: اجباری در production
- **Password Hashing**: Django's built-in PBKDF2

---

**تاریخ ایجاد مستند**: 2025-12-02  
**نسخه**: 1.0.0
