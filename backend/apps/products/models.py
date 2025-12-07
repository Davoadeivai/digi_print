from django.db import models
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.conf import settings

User = get_user_model()

class ProductCategory(models.Model):
    """
    دسته‌بندی محصولات چاپی
    """
    name = models.CharField('نام دسته‌بندی', max_length=100)
    slug = models.SlugField('اسلاگ', max_length=120, unique=True)
    description = models.TextField('توضیحات', blank=True)
    image = models.ImageField('تصویر', upload_to='categories/', null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    is_active = models.BooleanField('فعال', default=True)
    created_at = models.DateTimeField('تاریخ ایجاد', auto_now_add=True)
    updated_at = models.DateTimeField('آخرین به‌روزرسانی', auto_now=True)

    class Meta:
        verbose_name = 'دسته‌بندی محصول'
        verbose_name_plural = 'دسته‌بندی‌های محصولات'
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('products:category_detail', kwargs={'slug': self.slug})


class Product(models.Model):
    """
    محصولات چاپی
    """
    PRINT_TYPES = [
        ('digital', 'چاپ دیجیتال'),
        ('offset', 'چاپ افست'),
        ('both', 'هر دو'),
    ]

    name = models.CharField('نام محصول', max_length=200)
    slug = models.SlugField('اسلاگ', max_length=220, unique=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')
    description = models.TextField('توضیحات کامل')
    short_description = models.CharField('توضیحات کوتاه', max_length=300)
    image = models.ImageField('تصویر اصلی', upload_to='products/')
    gallery = models.ImageField('گالری تصاویر', upload_to='products/gallery/', null=True, blank=True)
    
    # مشخصات چاپ
    print_type = models.CharField('نوع چاپ', max_length=10, choices=PRINT_TYPES, default='digital')
    min_quantity = models.PositiveIntegerField('حداقل تیراژ', default=1)
    max_quantity = models.PositiveIntegerField('حداکثر تیراژ', default=10000)
    delivery_time_hours = models.PositiveIntegerField('زمان تحویل (ساعت)', default=24)
    
    # ویژگی‌های خاص
    has_design_service = models.BooleanField('خدمات طراحی', default=True)
    has_online_calculator = models.BooleanField('ماشین حساب آنلاین', default=True)
    has_file_upload = models.BooleanField('آپلود فایل', default=True)
    
    # قیمت‌گذاری
    base_price = models.DecimalField('قیمت پایه', max_digits=10, decimal_places=0)
    price_per_extra = models.DecimalField('قیمت هر واحد اضافی', max_digits=10, decimal_places=0, null=True, blank=True)
    
    # SEO و متادیتا
    meta_title = models.CharField('عنوان SEO', max_length=200, blank=True)
    meta_description = models.CharField('توضیحات SEO', max_length=300, blank=True)
    
    is_active = models.BooleanField('فعال', default=True)
    is_featured = models.BooleanField('محصول ویژه', default=False)
    created_at = models.DateTimeField('تاریخ ایجاد', auto_now_add=True)
    updated_at = models.DateTimeField('آخرین به‌روزرسانی', auto_now=True)

    class Meta:
        verbose_name = 'محصول چاپی'
        verbose_name_plural = 'محصولات چاپی'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('products:product_detail', kwargs={'slug': self.slug})

    def get_calculated_price(self, quantity, **kwargs):
        """
        محاسبه قیمت بر اساس تعداد و ویژگی‌های دیگر
        """
        base_total = self.base_price
        
        if quantity > self.min_quantity:
            extra_units = quantity - self.min_quantity
            if self.price_per_extra:
                base_total += extra_units * self.price_per_extra
            else:
                # اگر قیمت واحد اضافی مشخص نشده، از تخفیف حجمی استفاده کن
                discount_rate = min(extra_units * 0.02, 0.3)  # حداکثر 30% تخفیف
                base_total *= (1 - Decimal(str(discount_rate)))
        
        # اضافه کردن هزینه‌های اضافی بر اساس kwargs
        extra_cost = 0
        
        # هزینه طراحی
        if kwargs.get('include_design', False):
            extra_cost += 50000  # 50 هزار تومان هزینه طراحی
            
        # هزینه پوشش‌های خاص
        if kwargs.get('lamination'):
            extra_cost += quantity * 200  # 200 تومان برای هر عدد لمینت
            
        if kwargs.get('uv_coating'):
            extra_cost += quantity * 300  # 300 تومان برای هر عدد UV
            
        # هزینه کاغذهای خاص
        if kwargs.get('paper_type') == 'fancy':
            extra_cost += quantity * 150
            
        return base_total + extra_cost


class PaperType(models.Model):
    """
    انواع کاغذ و مقوا
    """
    name = models.CharField('نام کاغذ', max_length=100)
    slug = models.SlugField('اسلاگ', max_length=120, unique=True)
    description = models.TextField('توضیحات')
    gram_weight = models.PositiveIntegerField('گرماژ')
    price_per_sheet = models.DecimalField('قیمت هر برگ', max_digits=8, decimal_places=0)
    is_fancy = models.BooleanField('کاغذ فانتزی', default=False)
    texture = models.CharField('بافت', max_length=100, blank=True)
    image = models.ImageField('تصویر نمونه', upload_to='papers/', null=True, blank=True)
    is_active = models.BooleanField('فعال', default=True)

    class Meta:
        verbose_name = 'نوع کاغذ'
        verbose_name_plural = 'انواع کاغذ'
        ordering = ['gram_weight', 'name']

    def __str__(self):
        return f"{self.name} - {self.gram_weight}گرم"


class ProductPaperType(models.Model):
    """
    کاغذهای قابل استفاده برای هر محصول
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='paper_types')
    paper_type = models.ForeignKey(PaperType, on_delete=models.CASCADE)
    is_default = models.BooleanField('پیش‌فرض', default=False)

    class Meta:
        verbose_name = 'کاغذ محصول'
        verbose_name_plural = 'کاغذهای محصول'
        unique_together = ['product', 'paper_type']

    def __str__(self):
        return f"{self.product.name} - {self.paper_type.name}"


class PricingRule(models.Model):
    """
    قوانین قیمت‌گذاری پیشرفته
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='pricing_rules')
    min_quantity = models.PositiveIntegerField('حداقل تعداد')
    max_quantity = models.PositiveIntegerField('حداکثر تعداد')
    price_per_unit = models.DecimalField('قیمت هر واحد', max_digits=8, decimal_places=0)
    
    # شرایط خاص
    paper_type = models.ForeignKey(PaperType, on_delete=models.CASCADE, null=True, blank=True)
    has_lamination = models.BooleanField('لمینت', default=False)
    has_uv = models.BooleanField('UV', default=False)
    
    is_active = models.BooleanField('فعال', default=True)

    class Meta:
        verbose_name = 'قانون قیمت‌گذاری'
        verbose_name_plural = 'قوانین قیمت‌گذاری'
        ordering = ['min_quantity']

    def __str__(self):
        return f"{self.product.name} - {self.min_quantity}-{self.max_quantity} عدد"

    def applies_to_quantity(self, quantity):
        """بررسی اینکه آیا این قانون برای تعداد مشخص اعمال می‌شود"""
        return self.min_quantity <= quantity <= self.max_quantity


class Order(models.Model):
    """
    سفارشات مشتریان
    """
    STATUS_CHOICES = [
        ('pending', 'در انتظار بررسی'),
        ('confirmed', 'تأیید شده'),
        ('in_progress', 'در حال انجام'),
        ('ready', 'آماده تحویل'),
        ('delivered', 'تحویل داده شده'),
        ('cancelled', 'لغو شده'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_orders')
    order_number = models.CharField('شماره سفارش', max_length=20, unique=True)
    status = models.CharField('وضعیت', max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # اطلاعات تماس
    contact_name = models.CharField('نام تماس', max_length=100)
    contact_phone = models.CharField('تلفن تماس', max_length=20)
    contact_email = models.EmailField('ایمیل تماس')
    
    # آدرس تحویل
    delivery_address = models.TextField('آدرس تحویل')
    delivery_city = models.CharField('شهر', max_length=50)
    delivery_postal_code = models.CharField('کد پستی', max_length=10, blank=True)
    
    # زمان‌بندی
    delivery_method = models.CharField('نحوه تحویل', max_length=50, default='پیک')
    delivery_date = models.DateField('تاریخ تحویل', null=True, blank=True)
    urgent_order = models.BooleanField('سفارش فوری', default=False)
    
    # مالی
    subtotal = models.DecimalField('جمع کل', max_digits=12, decimal_places=0)
    discount_amount = models.DecimalField('تخفیف', max_digits=10, decimal_places=0, default=0)
    delivery_cost = models.DecimalField('هزینه ارسال', max_digits=8, decimal_places=0, default=0)
    total_amount = models.DecimalField('مبلغ نهایی', max_digits=12, decimal_places=0)
    
    # فایل‌ها
    design_files = models.FileField('فایل طراحی', upload_to='orders/designs/', null=True, blank=True)
    
    # یادداشت‌ها
    customer_notes = models.TextField('یادداشت مشتری', blank=True)
    admin_notes = models.TextField('یادداشت ادمین', blank=True)
    
    created_at = models.DateTimeField('تاریخ ایجاد', auto_now_add=True)
    updated_at = models.DateTimeField('آخرین به‌روزرسانی', auto_now=True)

    class Meta:
        verbose_name = 'سفارش'
        verbose_name_plural = 'سفارشات'
        ordering = ['-created_at']

    def __str__(self):
        return f"سفارش #{self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            # ایجاد شماره سفارش منحصر به فرد
            import uuid
            self.order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        
        # محاسبه مبلغ نهایی
        self.total_amount = self.subtotal - self.discount_amount + self.delivery_cost
        
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """
    آیتم‌های هر سفارش
    """
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
    
    # یادداشت‌های خاص این آیتم
    special_instructions = models.TextField('دستورالعمل‌های خاص', blank=True)

    class Meta:
        verbose_name = 'آیتم سفارش'
        verbose_name_plural = 'آیتم‌های سفارش'

    def __str__(self):
        return f"{self.product.name} - {self.quantity} عدد"

    def save(self, *args, **kwargs):
        # محاسبه قیمت کل
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)


class UploadedFile(models.Model):
    """
    فایل‌های آپلود شده توسط کاربران
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')
    file = models.FileField('فایل', upload_to='user_files/')
    original_name = models.CharField('نام اصلی فایل', max_length=255)
    file_type = models.CharField('نوع فایل', max_length=50)
    file_size = models.PositiveIntegerField('حجم فایل (بایت)')
    
    # ارتباط با محصول یا سفارش
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    
    # پیش‌نمایش
    thumbnail = models.ImageField('تصویر بندانگشتی', upload_to='user_files/thumbnails/', null=True, blank=True)
    
    # وضعیت پردازش
    status = models.CharField('وضعیت', max_length=20, default='uploaded')
    processing_notes = models.TextField('یادداشت‌های پردازش', blank=True)
    
    uploaded_at = models.DateTimeField('تاریخ آپلود', auto_now_add=True)

    class Meta:
        verbose_name = 'فایل آپلود شده'
        verbose_name_plural = 'فایل‌های آپلود شده'
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.original_name} - {self.user.email}"

    def save(self, *args, **kwargs):
        if self.file:
            self.file_type = self.file.name.split('.')[-1].lower()
            self.file_size = self.file.size
        super().save(*args, **kwargs)
