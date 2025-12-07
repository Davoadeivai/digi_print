# 📚 مستندات تکمیلی Backend - اجزای از قلم افتاده

## بخش‌های اضافه شده به مستندات

### 📄 `apps/accounts/serializers.py` - جزئیات کامل
**خطوط**: 1-256

#### Serializers اصلی با جزئیات:

**UserRegistrationSerializer** (خطوط 12-90):
- فیلدهای اعتبارسنجی شده با پیام‌های خطای فارسی
- اعتبارسنجی قدرت رمز عبور
- ایجاد خودکار UserProfile

**NXTBN-Style Serializers** (خطوط 187-256):
- `UserSerializer`: با آمار سفارشات
- `UserStatsSerializer`: آمار کامل کاربر
- `UserAdminSerializer`: مدیریت کاربران

---

### 📄 `apps/products/views.py` - 418 خط
**ViewSets پیشرفته**:

**ProductViewSet** (خطوط 44-129):
- `calculate_price`: محاسبه قیمت پویا
- `featured`: محصولات ویژه
- `search`: جستجوی پیشرفته با فیلترها

**OrderViewSet** (خطوط 166-272):
- `tracking`: پیگیری سفارش با تاریخچه 5 مرحله‌ای
- `cancel`: لغو سفارش با بررسی وضعیت

**UploadedFileViewSet** (خطوط 275-340):
- بررسی حجم (حداکثر 50MB)
- بررسی نوع فایل (9 فرمت مجاز)

---

### 📄 `apps/core/middleware.py` - 4 Middleware
1. **RequestLoggingMiddleware**: لاگ با زمان پردازش
2. **UserActivityMiddleware**: بروزرسانی last_login
3. **IPAddressMiddleware**: دریافت IP واقعی
4. **MaintenanceModeMiddleware**: حالت تعمیر

---

### 📄 `apps/products/urls.py` - Router + URLs
**5 ViewSet** + **8 URL اضافی**:
- calculator, home, navigation
- featured, search
- tracking, cancel

---

## 📊 آمار به‌روز شده

- **Serializers**: 15+ serializer
- **ViewSets**: 5 viewset
- **Middleware**: 4 middleware
- **API Endpoints**: 30+ endpoint
- **Function Views**: 4 view
