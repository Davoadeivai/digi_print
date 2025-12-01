from django.contrib import admin
from .models import (
    ProductCategory, Product, PaperType, ProductPaperType,
    PricingRule, Order, OrderItem, UploadedFile
)

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'is_active', 'created_at']
    list_filter = ['is_active', 'parent']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'print_type', 'base_price', 'is_active', 'is_featured']
    list_filter = ['print_type', 'is_active', 'is_featured', 'category']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('اطلاعات اصلی', {
            'fields': ('name', 'slug', 'category', 'description', 'short_description', 'image', 'gallery')
        }),
        ('مشخصات چاپ', {
            'fields': ('print_type', 'min_quantity', 'max_quantity', 'delivery_time_hours')
        }),
        ('ویژگی‌ها', {
            'fields': ('has_design_service', 'has_online_calculator', 'has_file_upload')
        }),
        ('قیمت‌گذاری', {
            'fields': ('base_price', 'price_per_extra')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('تنظیمات', {
            'fields': ('is_active', 'is_featured')
        }),
    )

@admin.register(PaperType)
class PaperTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'gram_weight', 'price_per_sheet', 'is_fancy', 'is_active']
    list_filter = ['is_fancy', 'is_active', 'gram_weight']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(PricingRule)
class PricingRuleAdmin(admin.ModelAdmin):
    list_display = ['product', 'min_quantity', 'max_quantity', 'price_per_unit', 'is_active']
    list_filter = ['is_active', 'paper_type', 'has_lamination', 'has_uv']
    search_fields = ['product__name']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    readonly_fields = ['total_price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'delivery_method', 'urgent_order', 'created_at']
    search_fields = ['order_number', 'contact_name', 'user__email']
    readonly_fields = ['order_number', 'total_amount']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('اطلاعات سفارش', {
            'fields': ('order_number', 'user', 'status', 'created_at')
        }),
        ('اطلاعات تماس', {
            'fields': ('contact_name', 'contact_phone', 'contact_email')
        }),
        ('آدرس تحویل', {
            'fields': ('delivery_address', 'delivery_city', 'delivery_postal_code')
        }),
        ('زمان‌بندی', {
            'fields': ('delivery_method', 'delivery_date', 'urgent_order')
        }),
        ('مالی', {
            'fields': ('subtotal', 'discount_amount', 'delivery_cost', 'total_amount')
        }),
        ('فایل‌ها و یادداشت‌ها', {
            'fields': ('design_files', 'customer_notes', 'admin_notes')
        }),
    )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'unit_price', 'total_price']
    list_filter = ['has_lamination', 'has_uv_coating', 'include_design']
    search_fields = ['product__name', 'order__order_number']

@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ['original_name', 'user', 'file_type', 'file_size', 'status', 'uploaded_at']
    list_filter = ['file_type', 'status', 'uploaded_at']
    search_fields = ['original_name', 'user__email']
    readonly_fields = ['file_size', 'file_type']
