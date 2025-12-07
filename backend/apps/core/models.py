"""
مدل‌های پایه و مشترک
"""
from django.db import models
from django.utils.translation import gettext_lazy as _


class TimeStampedModel(models.Model):
    """
    مدل پایه برای ذخیره تاریخ ایجاد و بروزرسانی
    سایر مدل‌ها می‌توانند از این ارث‌بری کنند
    """
    created_at = models.DateTimeField(_('تاریخ ایجاد'), auto_now_add=True)
    updated_at = models.DateTimeField(_('تاریخ بروزرسانی'), auto_now=True)
    
    class Meta:
        abstract = True
        ordering = ['-created_at']


class SoftDeleteModel(models.Model):
    """
    مدل پایه برای حذف نرم (Soft Delete)
    به جای حذف واقعی، فیلد is_deleted را True می‌کند
    """
    is_deleted = models.BooleanField(_('حذف شده'), default=False)
    deleted_at = models.DateTimeField(_('تاریخ حذف'), null=True, blank=True)
    
    class Meta:
        abstract = True
    
    def soft_delete(self):
        """حذف نرم رکورد"""
        from django.utils import timezone
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()
    
    def restore(self):
        """بازگردانی رکورد حذف شده"""
        self.is_deleted = False
        self.deleted_at = None
        self.save()


class SEOModel(models.Model):
    """
    مدل پایه برای متا تگ‌های SEO
    """
    meta_title = models.CharField(_('عنوان متا'), max_length=255, blank=True)
    meta_description = models.TextField(_('توضیحات متا'), max_length=500, blank=True)
    meta_keywords = models.CharField(_('کلمات کلیدی'), max_length=255, blank=True)
    
    class Meta:
        abstract = True


class Settings(models.Model):
    """
    مدل تنظیمات عمومی سایت
    برای ذخیره تنظیماتی که از پنل ادمین قابل تغییر هستند
    """
    key = models.CharField(_('کلید'), max_length=255, unique=True)
    value = models.TextField(_('مقدار'))
    description = models.TextField(_('توضیحات'), blank=True)
    is_active = models.BooleanField(_('فعال'), default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('تنظیمات')
        verbose_name_plural = _('تنظیمات')
        ordering = ['key']
    
    def __str__(self):
        return f'{self.key}: {self.value[:50]}'
    
    @classmethod
    def get_value(cls, key, default=None):
        """دریافت مقدار یک تنظیم"""
        try:
            return cls.objects.get(key=key, is_active=True).value
        except cls.DoesNotExist:
            return default
    
    @classmethod
    def set_value(cls, key, value, description=''):
        """تنظیم مقدار یک تنظیم"""
        obj, created = cls.objects.update_or_create(
            key=key,
            defaults={'value': value, 'description': description}
        )
        return obj


class NewsletterSubscriber(models.Model):
    email = models.EmailField(_('ایمیل'), unique=True)
    is_active = models.BooleanField(_('فعال'), default=True)
    subscribed_at = models.DateTimeField(_('تاریخ عضویت'), auto_now_add=True)

    class Meta:
        verbose_name = _('مشترک خبرنامه')
        verbose_name_plural = _('مشترکین خبرنامه')
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email


class CompanySettings(models.Model):
    """
    تنظیمات شرکت
    برای مدیریت اطلاعات شرکت از پنل ادمین
    """
    name = models.CharField(_('نام شرکت'), max_length=200)
    description = models.TextField(_('توضیحات کوتاه'), blank=True)
    about = models.TextField(_('درباره ما'), blank=True)
    phone = models.CharField(_('تلفن'), max_length=20, blank=True)
    email = models.EmailField(_('ایمیل'), blank=True)
    address = models.TextField(_('آدرس'), blank=True)
    working_hours = models.CharField(_('ساعات کاری'), max_length=200, blank=True)
    social_media = models.JSONField(_('شبکه‌های اجتماعی'), default=dict, blank=True)
    logo = models.ImageField(_('لوگو'), upload_to='company/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('تنظیمات شرکت')
        verbose_name_plural = _('تنظیمات شرکت')
    
    def __str__(self):
        return self.name or 'تنظیمات شرکت'
    
    @classmethod
    def get_settings(cls):
        """دریافت تنظیمات شرکت (singleton pattern)"""
        settings, created = cls.objects.get_or_create(pk=1)
        return settings


class UploadedFile(models.Model):
    """
    فایل‌های آپلود شده
    برای مدیریت فایل‌های آپلود شده توسط کاربران
    """
    file = models.FileField(_('فایل'), upload_to='uploads/%Y/%m/%d/')
    folder = models.CharField(_('پوشه'), max_length=100, blank=True)
    original_name = models.CharField(_('نام اصلی'), max_length=255)
    file_size = models.IntegerField(_('حجم فایل (بایت)'), default=0)
    file_type = models.CharField(_('نوع فایل'), max_length=100, blank=True)
    uploaded_by = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.CASCADE,
        related_name='core_uploaded_files',
        verbose_name=_('آپلود شده توسط')
    )
    is_public = models.BooleanField(_('عمومی'), default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('فایل آپلود شده')
        verbose_name_plural = _('فایل‌های آپلود شده')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.original_name
    
    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
            self.original_name = self.file.name
        super().save(*args, **kwargs)
