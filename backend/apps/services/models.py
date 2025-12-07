from django.db import models
from django.utils.text import slugify

class Service(models.Model):
    title = models.CharField(max_length=200, verbose_name='عنوان')
    slug = models.SlugField(unique=True, allow_unicode=True, verbose_name='اسلاگ')
    description = models.TextField(verbose_name='توضیحات')
    short_description = models.CharField(max_length=300, verbose_name='توضیحات کوتاه')
    
    # JSON Fields for flexible data
    features = models.JSONField(default=list, verbose_name='ویژگی‌ها')
    pricing = models.JSONField(default=dict, verbose_name='قیمت‌گذاری')
    gallery = models.JSONField(default=list, verbose_name='گالری تصاویر')
    specifications = models.JSONField(default=list, verbose_name='مشخصات فنی')
    
    # Status and SEO
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    meta_title = models.CharField(max_length=200, blank=True, verbose_name='عنوان متا')
    meta_description = models.CharField(max_length=300, blank=True, verbose_name='توضیحات متا')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'خدمت'
        verbose_name_plural = 'خدمات'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)
        super().save(*args, **kwargs)
