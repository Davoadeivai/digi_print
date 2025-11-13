"""
اعتبارسنجی‌های سفارشی
"""
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re


def validate_iranian_phone(value):
    """
    اعتبارسنجی شماره تلفن ایرانی
    فرمت: 09123456789 یا 9123456789 یا +989123456789
    """
    pattern = r'^(\+98|0)?9\d{9}$'
    if not re.match(pattern, value):
        raise ValidationError(
            _('شماره تلفن معتبر نیست. فرمت صحیح: 09123456789'),
            code='invalid_phone'
        )


def validate_iranian_postal_code(value):
    """
    اعتبارسنجی کد پستی ایرانی
    فرمت: 10 رقمی بدون فاصله
    """
    pattern = r'^\d{10}$'
    if not re.match(pattern, value):
        raise ValidationError(
            _('کد پستی باید 10 رقم باشد'),
            code='invalid_postal_code'
        )


def validate_file_size(file, max_size_mb=10):
    """
    اعتبارسنجی حجم فایل
    max_size_mb: حداکثر حجم به مگابایت
    """
    max_size = max_size_mb * 1024 * 1024  # تبدیل به بایت
    if file.size > max_size:
        raise ValidationError(
            _(f'حجم فایل نباید بیشتر از {max_size_mb} مگابایت باشد'),
            code='file_too_large'
        )


def validate_image_extension(file):
    """
    اعتبارسنجی پسوند فایل تصویر
    """
    allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    extension = file.name.split('.')[-1].lower()
    if extension not in allowed_extensions:
        raise ValidationError(
            _(f'فرمت فایل باید یکی از موارد زیر باشد: {", ".join(allowed_extensions)}'),
            code='invalid_extension'
        )


def validate_design_file_extension(file):
    """
    اعتبارسنجی فایل‌های طراحی
    """
    allowed_extensions = ['pdf', 'ai', 'psd', 'eps', 'cdr', 'svg', 'indd']
    extension = file.name.split('.')[-1].lower()
    if extension not in allowed_extensions:
        raise ValidationError(
            _(f'فرمت فایل باید یکی از موارد زیر باشد: {", ".join(allowed_extensions)}'),
            code='invalid_design_file'
        )


def validate_not_empty(value):
    """
    اعتبارسنجی خالی نبودن مقدار
    """
    if not value or not value.strip():
        raise ValidationError(
            _('این فیلد نمی‌تواند خالی باشد'),
            code='empty_value'
        )


def validate_positive_number(value):
    """
    اعتبارسنجی عدد مثبت
    """
    if value <= 0:
        raise ValidationError(
            _('مقدار باید بزرگتر از صفر باشد'),
            code='not_positive'
        )


def validate_slug(value):
    """
    اعتبارسنجی اسلاگ
    فقط حروف، اعداد، خط تیره و آندرلاین
    """
    pattern = r'^[\w\-]+$'
    if not re.match(pattern, value):
        raise ValidationError(
            _('اسلاگ فقط می‌تواند شامل حروف، اعداد، خط تیره و آندرلاین باشد'),
            code='invalid_slug'
        )
