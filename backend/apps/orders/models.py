from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from apps.accounts.models import CustomUser
from apps.products.models import Product


class QuoteRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'در انتظار بررسی'),
        ('processing', 'در حال پردازش'),
        ('designing', 'در حال طراحی'),
        ('printing', 'در حال چاپ'),
        ('completed', 'تکمیل شده'),
        ('cancelled', 'لغو شده'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='quote_requests', verbose_name=_('کاربر'))
    customer_name = models.CharField(_('نام مشتری'), max_length=100)
    customer_email = models.EmailField(_('ایمیل مشتری'))
    customer_phone = models.CharField(_('تلفن مشتری'), max_length=20)

    service_type = models.CharField(_('نوع سرویس'), max_length=100)
    project_details = models.TextField(_('جزئیات پروژه'))
    budget_range = models.CharField(_('بودجه تقریبی'), max_length=100, blank=True)
    deadline = models.DateField(_('مهلت تحویل'), null=True, blank=True)

    files = models.JSONField(_('فایل‌های پیوست'), default=list, blank=True)
    special_requirements = models.TextField(_('نیازهای خاص'), blank=True)

    status = models.CharField(_('وضعیت'), max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(_('یادداشت‌های ادمین'), blank=True)

    created_at = models.DateTimeField(_('تاریخ ایجاد'), auto_now_add=True)
    updated_at = models.DateTimeField(_('آخرین بروزرسانی'), auto_now=True)

    class Meta:
        verbose_name = _('درخواست قیمت')
        verbose_name_plural = _('درخواست‌های قیمت')
        ordering = ['-created_at']

    def __str__(self):
        return f"درخواست {self.id} - {self.customer_name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'در انتظار تأیید'),
        ('confirmed', 'تأیید شده'),
        ('processing', 'در حال پردازش'),
        ('shipped', 'ارسال شده'),
        ('delivered', 'تحویل داده شده'),
        ('cancelled', 'لغو شده'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.product:
            self.total_price = self.product.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f'سفارش {self.id}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name=_('سفارش'))
    product = models.ForeignKey(Product, on_delete=models.PROTECT, verbose_name=_('محصول'))
    quantity = models.PositiveIntegerField(default=1, verbose_name=_('تعداد'))

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_('قیمت واحد')
    )

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name=_('قیمت کل')
    )

    specifications = models.JSONField(default=dict, blank=True, verbose_name=_('مشخصات سفارش'))

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.total_price = self.price * self.quantity
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('آیتم سفارش')
        verbose_name_plural = _('آیتم‌های سفارش')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.product.name} × {self.quantity}'
