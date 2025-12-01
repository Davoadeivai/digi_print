from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.conf import settings

from .models import (
    ProductCategory, Product, PaperType, ProductPaperType,
    PricingRule, Order, OrderItem, UploadedFile
)
from .serializers import (
    ProductCategorySerializer, ProductSerializer, ProductDetailSerializer,
    PaperTypeSerializer, PricingRuleSerializer, OrderSerializer,
    CreateOrderSerializer, UploadedFileSerializer, PriceCalculatorSerializer
)


class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ویوست برای دسته‌بندی‌های محصولات
    """
    queryset = ProductCategory.objects.filter(is_active=True, parent=None)
    serializer_class = ProductCategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """دریافت محصولات یک دسته‌بندی خاص"""
        category = self.get_object()
        products = Product.objects.filter(
            category__in=category.get_descendants(include_self=True),
            is_active=True
        )
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ویوست برای محصولات چاپی
    """
    queryset = Product.objects.filter(is_active=True)
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'print_type', 'is_featured']
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['name', 'base_price', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer

    @action(detail=True, methods=['get'])
    def similar_products(self, request, pk=None):
        """محصولات مشابه"""
        product = self.get_object()
        similar = Product.objects.filter(
            category=product.category,
            is_active=True
        ).exclude(id=product.id)[:4]
        serializer = ProductSerializer(similar, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def calculate_price(self, request, pk=None):
        """محاسبه قیمت محصول"""
        product = self.get_object()
        serializer = PriceCalculatorSerializer(data=request.data)
        
        if serializer.is_valid():
            # اطمینان از اینکه محصول_id با محصول فعلی مطابقت دارد
            if serializer.validated_data['product_id'] != product.id:
                return Response(
                    {'error': 'محصول نامعتبر است'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            result = serializer.calculate_price()
            return Response(result)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """محصولات ویژه"""
        featured = self.queryset.filter(is_featured=True)[:8]
        serializer = ProductSerializer(featured, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """جستجوی پیشرفته محصولات"""
        query = request.GET.get('q', '')
        category = request.GET.get('category')
        print_type = request.GET.get('print_type')
        min_price = request.GET.get('min_price')
        max_price = request.GET.get('max_price')

        products = self.queryset

        if query:
            products = products.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(short_description__icontains=query)
            )

        if category:
            products = products.filter(category_id=category)

        if print_type:
            products = products.filter(print_type=print_type)

        if min_price:
            products = products.filter(base_price__gte=min_price)

        if max_price:
            products = products.filter(base_price__lte=max_price)

        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)


class PaperTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ویوست برای انواع کاغذ
    """
    queryset = PaperType.objects.filter(is_active=True)
    serializer_class = PaperTypeSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['gram_weight', 'name', 'price_per_sheet']

    @action(detail=False, methods=['get'])
    def fancy_papers(self, request):
        """کاغذهای فانتزی"""
        fancy = self.queryset.filter(is_fancy=True)
        serializer = self.get_serializer(fancy, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def price_calculator(request):
    """
    ماشین حساب قیمت آنلاین
    """
    serializer = PriceCalculatorSerializer(data=request.data)
    
    if serializer.is_valid():
        result = serializer.calculate_price()
        return Response(result)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderViewSet(viewsets.ModelViewSet):
    """
    ویوست برای مدیریت سفارشات
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        """ایجاد سفارش جدید"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # اضافه کردن کاربر به سفارش
        order = serializer.save(user=request.user)
        
        # سریالایزر برای پاسخ
        response_serializer = OrderSerializer(order, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def user_orders(self, request):
        """سفارشات کاربر"""
        orders = self.get_queryset()
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """لغو سفارش"""
        order = self.get_object()
        
        if order.status not in ['pending', 'confirmed']:
            return Response(
                {'error': 'این سفارش قابل لغو نیست'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.save()
        
        return Response({'message': 'سفارش با موفقیت لغو شد'})

    @action(detail=True, methods=['get'])
    def tracking(self, request, pk=None):
        """پیگیری سفارش"""
        order = self.get_object()
        
        tracking_data = {
            'order_number': order.order_number,
            'status': order.status,
            'status_display': order.get_status_display(),
            'created_at': order.created_at,
            'estimated_delivery': order.delivery_date,
            'items': OrderItem.objects.filter(order=order).count(),
            'tracking_history': [
                {
                    'status': 'pending',
                    'title': 'سفارش دریافت شد',
                    'description': 'سفارش شما در حال بررسی است',
                    'time': order.created_at,
                    'completed': order.status != 'pending'
                },
                {
                    'status': 'confirmed',
                    'title': 'سفارش تأیید شد',
                    'description': 'سفارش شما تأیید و در حال آماده‌سازی است',
                    'time': order.updated_at,
                    'completed': order.status in ['in_progress', 'ready', 'delivered']
                },
                {
                    'status': 'in_progress',
                    'title': 'در حال انجام',
                    'description': 'سفارش شما در حال چاپ و آماده‌سازی است',
                    'time': None,
                    'completed': order.status in ['ready', 'delivered']
                },
                {
                    'status': 'ready',
                    'title': 'آماده تحویل',
                    'description': 'سفارش شما آماده تحویل است',
                    'time': None,
                    'completed': order.status == 'delivered'
                },
                {
                    'status': 'delivered',
                    'title': 'تحویل داده شده',
                    'description': 'سفارش شما با موفقیت تحویل داده شد',
                    'time': None,
                    'completed': order.status == 'delivered'
                }
            ]
        }
        
        return Response(tracking_data)


class UploadedFileViewSet(viewsets.ModelViewSet):
    """
    ویوست برای مدیریت فایل‌های آپلود شده
    """
    serializer_class = UploadedFileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return UploadedFile.objects.filter(user=self.request.user).order_by('-uploaded_at')

    def create(self, request, *args, **kwargs):
        """آپلود فایل جدید"""
        file_obj = request.FILES.get('file')
        product_id = request.data.get('product_id')
        
        if not file_obj:
            return Response(
                {'error': 'فایل را انتخاب کنید'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # بررسی حجم فایل (حداکثر 50MB)
        if file_obj.size > 50 * 1024 * 1024:
            return Response(
                {'error': 'حجم فایل نباید بیشتر از 50 مگابایت باشد'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # بررسی نوع فایل
        allowed_types = ['pdf', 'jpg', 'jpeg', 'png', 'psd', 'ai', 'cdr', 'eps', 'tiff']
        file_type = file_obj.name.split('.')[-1].lower()
        if file_type not in allowed_types:
            return Response(
                {'error': f'نوع فایل مجاز نیست. انواع مجاز: {", ".join(allowed_types)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ایجاد رکورد فایل
        uploaded_file = UploadedFile.objects.create(
            user=request.user,
            file=file_obj,
            original_name=file_obj.name,
            product_id=product_id if product_id else None
        )

        serializer = self.get_serializer(uploaded_file, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def assign_to_order(self, request, pk=None):
        """انتساب فایل به سفارش"""
        uploaded_file = self.get_object()
        order_id = request.data.get('order_id')
        
        try:
            order = Order.objects.get(id=order_id, user=request.user)
            uploaded_file.order = order
            uploaded_file.save()
            
            return Response({'message': 'فایل با موفقیت به سفارش منتسب شد'})
        except Order.DoesNotExist:
            return Response(
                {'error': 'سفارش یافت نشد'},
                status=status.HTTP_404_NOT_FOUND
            )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def home_data(request):
    """
    داده‌های صفحه اصلی
    """
    # محصولات ویژه
    featured_products = Product.objects.filter(is_active=True, is_featured=True)[:6]
    
    # دسته‌بندی‌های اصلی
    main_categories = ProductCategory.objects.filter(is_active=True, parent=None)[:8]
    
    # آخرین محصولات
    latest_products = Product.objects.filter(is_active=True)[:8]
    
    data = {
        'featured_products': ProductSerializer(featured_products, many=True, context={'request': request}).data,
        'main_categories': ProductCategorySerializer(main_categories, many=True).data,
        'latest_products': ProductSerializer(latest_products, many=True, context={'request': request}).data,
        'stats': {
            'total_products': Product.objects.filter(is_active=True).count(),
            'total_categories': ProductCategory.objects.filter(is_active=True).count(),
            'digital_print_products': Product.objects.filter(is_active=True, print_type='digital').count(),
            'offset_print_products': Product.objects.filter(is_active=True, print_type='offset').count(),
        }
    }
    
    return Response(data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def navigation_data(request):
    """
    داده‌های نویگیشن (منو)
    """
    categories = ProductCategory.objects.filter(
        is_active=True, 
        parent=None
    ).prefetch_related('children')
    
    data = {
        'categories': ProductCategorySerializer(categories, many=True).data,
        'quick_links': [
            {'title': 'چاپ دیجیتال', 'url': '/products/?print_type=digital'},
            {'title': 'چاپ افست', 'url': '/products/?print_type=offset'},
            {'title': 'محصولات ویژه', 'url': '/products/featured/'},
            {'title': 'محاسبه قیمت', 'url': '/calculator/'},
            {'title': 'سفارش سریع', 'url': '/order/'},
        ]
    }
    
    return Response(data)


# Error handling views
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def api_info(request):
    """
    اطلاعات API
    """
    return Response({
        'name': 'دیجی چاپوگراف API',
        'version': '1.0.0',
        'description': 'API برای خدمات چاپ دیجیتال و افست',
        'endpoints': {
            'products': '/api/v1/products/',
            'categories': '/api/v1/categories/',
            'orders': '/api/v1/orders/',
            'upload': '/api/v1/upload/',
            'calculator': '/api/v1/calculator/',
            'home': '/api/v1/home/',
        }
    })
