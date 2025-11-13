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
