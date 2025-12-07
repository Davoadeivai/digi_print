from rest_framework import serializers
from .models import (
    ProductCategory, Product, PaperType, ProductPaperType,
    PricingRule, UploadedFile
)
from apps.orders.models import Order, OrderItem


class ProductCategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = ProductCategory
        fields = [
            'id', 'name', 'slug', 'description', 'image', 'parent',
            'children', 'product_count', 'is_active', 'created_at'
        ]

    def get_children(self, obj):
        children = obj.children.filter(is_active=True)
        return ProductCategorySerializer(children, many=True).data

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class PaperTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaperType
        fields = [
            'id', 'name', 'slug', 'description', 'gram_weight',
            'price_per_sheet', 'is_fancy', 'texture', 'image', 'is_active'
        ]


class ProductPaperTypeSerializer(serializers.ModelSerializer):
    paper_type = PaperTypeSerializer(read_only=True)

    class Meta:
        model = ProductPaperType
        fields = ['id', 'paper_type', 'is_default']


class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    paper_types = ProductPaperTypeSerializer(source='productpapertype_set', many=True, read_only=True)
    calculated_price = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    gallery_urls = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'description', 'short_description',
            'image', 'image_url', 'gallery', 'gallery_urls',
            'print_type', 'min_quantity', 'max_quantity', 'delivery_time_hours',
            'has_design_service', 'has_online_calculator', 'has_file_upload',
            'base_price', 'price_per_extra', 'paper_types', 'calculated_price',
            'meta_title', 'meta_description', 'is_active', 'is_featured',
            'created_at', 'updated_at'
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_gallery_urls(self, obj):
        if obj.gallery:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.gallery.url)
            return obj.gallery.url
        return None

    def get_calculated_price(self, obj):
        """محاسبه قیمت برای تعداد پیش‌فرض"""
        return obj.get_calculated_price(obj.min_quantity)


class ProductDetailSerializer(ProductSerializer):
    available_papers = serializers.SerializerMethodField()
    price_calculator = serializers.SerializerMethodField()

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['available_papers', 'price_calculator']

    def get_available_papers(self, obj):
        papers = obj.paper_types.all()
        return PaperTypeSerializer([pt.paper_type for pt in papers], many=True).data

    def get_price_calculator(self, obj):
        """اطلاعات ماشین حساب قیمت"""
        return {
            'min_quantity': obj.min_quantity,
            'max_quantity': obj.max_quantity,
            'base_price': obj.base_price,
            'price_per_extra': obj.price_per_extra,
            'has_design_service': obj.has_design_service,
            'design_cost': 50000 if obj.has_design_service else 0,
        }


class PricingRuleSerializer(serializers.ModelSerializer):
    paper_type = PaperTypeSerializer(read_only=True)

    class Meta:
        model = PricingRule
        fields = [
            'id', 'min_quantity', 'max_quantity', 'price_per_unit',
            'paper_type', 'has_lamination', 'has_uv', 'is_active'
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    paper_type = PaperTypeSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'quantity', 'unit_price', 'total_price',
            'paper_type', 'size_width', 'size_height',
            'has_lamination', 'has_uv_coating', 'include_design',
            'special_instructions'
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_info = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'user_info', 'status', 'status_display',
            'contact_name', 'contact_phone', 'contact_email',
            'delivery_address', 'delivery_city', 'delivery_postal_code',
            'delivery_method', 'delivery_date', 'urgent_order',
            'subtotal', 'discount_amount', 'delivery_cost', 'total_amount',
            'design_files', 'customer_notes', 'admin_notes',
            'items', 'created_at', 'updated_at'
        ]

    def get_user_info(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'email': obj.user.email,
                'full_name': obj.user.get_full_name() or obj.user.email,
            }
        return None

    def create(self, validated_data):
        # ایجاد شماره سفارش منحصر به فرد
        import uuid
        validated_data['order_number'] = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        return super().create(validated_data)


class CreateOrderSerializer(serializers.ModelSerializer):
    items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        min_length=1
    )

    class Meta:
        model = Order
        fields = [
            'contact_name', 'contact_phone', 'contact_email',
            'delivery_address', 'delivery_city', 'delivery_postal_code',
            'delivery_method', 'delivery_date', 'urgent_order',
            'customer_notes', 'items'
        ]

    def validate_items(self, items):
        """اعتبارسنجی آیتم‌های سفارش"""
        if not items:
            raise serializers.ValidationError("حداقل یک آیتم در سفارش باید وجود داشته باشد.")
        
        for item in items:
            required_fields = ['product_id', 'quantity', 'size_width', 'size_height']
            for field in required_fields:
                if field not in item:
                    raise serializers.ValidationError(f"فیلد {field} برای هر آیتم الزامی است.")
        
        return items

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # ایجاد سفارش
        order = Order.objects.create(**validated_data)
        
        # ایجاد آیتم‌های سفارش
        subtotal = 0
        for item_data in items_data:
            try:
                product = Product.objects.get(id=item_data['product_id'])
                
                # محاسبه قیمت
                unit_price = product.get_calculated_price(
                    item_data['quantity'],
                    include_design=item_data.get('include_design', False),
                    lamination=item_data.get('has_lamination', False),
                    uv_coating=item_data.get('has_uv_coating', False),
                    paper_type=item_data.get('paper_type')
                )
                
                total_price = unit_price * item_data['quantity']
                subtotal += total_price
                
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item_data['quantity'],
                    unit_price=unit_price,
                    total_price=total_price,
                    paper_type_id=item_data.get('paper_type'),
                    size_width=item_data['size_width'],
                    size_height=item_data['size_height'],
                    has_lamination=item_data.get('has_lamination', False),
                    has_uv_coating=item_data.get('has_uv_coating', False),
                    include_design=item_data.get('include_design', False),
                    special_instructions=item_data.get('special_instructions', '')
                )
            except Product.DoesNotExist:
                order.delete()
                raise serializers.ValidationError(f"محصول با شناسه {item_data['product_id']} یافت نشد.")
        
        # به‌روزرسانی جمع کل سفارش
        order.subtotal = subtotal
        order.save()
        
        return order


class UploadedFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    file_size_display = serializers.SerializerMethodField()

    class Meta:
        model = UploadedFile
        fields = [
            'id', 'file', 'file_url', 'original_name', 'file_type',
            'file_size', 'file_size_display', 'product', 'order',
            'thumbnail', 'thumbnail_url', 'status', 'processing_notes',
            'uploaded_at'
        ]

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None

    def get_file_size_display(self, obj):
        """نمایش حجم فایل به صورت خوانا"""
        size = obj.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"


class PriceCalculatorSerializer(serializers.Serializer):
    """
    سریالایزر برای محاسبه قیمت آنلاین
    """
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    size_width = serializers.DecimalField(max_digits=6, decimal_places=2)
    size_height = serializers.DecimalField(max_digits=6, decimal_places=2)
    paper_type_id = serializers.IntegerField(required=False, allow_null=True)
    include_design = serializers.BooleanField(default=False)
    has_lamination = serializers.BooleanField(default=False)
    has_uv_coating = serializers.BooleanField(default=False)

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value, is_active=True)
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("محصول یافت نشد یا غیرفعال است.")

    def validate_quantity(self, value):
        try:
            product = Product.objects.get(id=self.initial_data.get('product_id'))
            if value < product.min_quantity:
                raise serializers.ValidationError(f"حداقل تعداد برای این محصول {product.min_quantity} است.")
            if value > product.max_quantity:
                raise serializers.ValidationError(f"حداکثر تعداد برای این محصول {product.max_quantity} است.")
        except Product.DoesNotExist:
            pass
        return value

    def calculate_price(self):
        """محاسبه قیمت بر اساس پارامترها"""
        product_id = self.validated_data['product_id']
        product = Product.objects.get(id=product_id)
        
        kwargs = {
            'include_design': self.validated_data.get('include_design', False),
            'lamination': self.validated_data.get('has_lamination', False),
            'uv_coating': self.validated_data.get('has_uv_coating', False),
        }
        
        if self.validated_data.get('paper_type_id'):
            kwargs['paper_type'] = self.validated_data['paper_type_id']
        
        calculated_price = product.get_calculated_price(
            self.validated_data['quantity'],
            **kwargs
        )
        
        return {
            'product': ProductSerializer(product).data,
            'quantity': self.validated_data['quantity'],
            'unit_price': calculated_price / self.validated_data['quantity'],
            'total_price': calculated_price,
            'delivery_time_hours': product.delivery_time_hours,
            'breakdown': {
                'base_price': product.base_price,
                'quantity_surcharge': calculated_price - product.base_price,
                'design_cost': 50000 if kwargs.get('include_design') else 0,
                'lamination_cost': self.validated_data['quantity'] * 200 if kwargs.get('lamination') else 0,
                'uv_cost': self.validated_data['quantity'] * 300 if kwargs.get('uv_coating') else 0,
            }
        }
