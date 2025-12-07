from django.db import models
from django.utils.text import slugify

class PortfolioItem(models.Model):
    title = models.CharField(max_length=200, verbose_name='عنوان')
    slug = models.SlugField(unique=True, allow_unicode=True, verbose_name='اسلاگ')
    category = models.CharField(max_length=100, verbose_name='دسته‌بندی')
    client = models.CharField(max_length=200, verbose_name='مشتری')
    year = models.IntegerField(verbose_name='سال اجرا')
    
    description = models.TextField(verbose_name='توضیحات')
    
    # Case Study Fields
    challenge = models.TextField(blank=True, verbose_name='چالش')
    solution = models.TextField(blank=True, verbose_name='راهکار')
    result = models.TextField(blank=True, verbose_name='نتیجه')
    
    # JSON Fields
    images = models.JSONField(default=list, verbose_name='تصاویر')
    tags = models.JSONField(default=list, verbose_name='تگ‌ها')
    
    # Status
    is_featured = models.BooleanField(default=False, verbose_name='ویژه')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True, verbose_name='عنوان متا')
    meta_description = models.CharField(max_length=300, blank=True, verbose_name='توضیحات متا')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'نمونه کار'
        verbose_name_plural = 'نمونه کارها'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)
        super().save(*args, **kwargs)
