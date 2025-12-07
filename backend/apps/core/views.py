"""
Core app views
"""
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET"])
def health_check(request):
    """
    Health check endpoint for monitoring services like Render
    Returns a simple JSON response indicating the service is running
    """
    return JsonResponse({"status": "ok", "message": "Service is healthy"}, status=200)


from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import NewsletterSubscriber
from .serializers import NewsletterSubscriberSerializer

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAdminUser]  # Default permission

    def get_permissions(self):
        if self.action in ['subscribe', 'unsubscribe']:
            return [AllowAny()]
        return [IsAdminUser()]

    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        subscriber, created = NewsletterSubscriber.objects.get_or_create(email=email)
        if not created and not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save()
            
        return Response({'status': 'subscribed', 'message': 'Successfully subscribed to newsletter'})

    @action(detail=False, methods=['post'])
    def unsubscribe(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            subscriber = NewsletterSubscriber.objects.get(email=email)
            subscriber.is_active = False
            subscriber.save()
            return Response({'status': 'unsubscribed', 'message': 'Successfully unsubscribed'})
        except NewsletterSubscriber.DoesNotExist:
            return Response({'error': 'Subscriber not found'}, status=status.HTTP_404_NOT_FOUND)


# -----------------------------
# Analytics Views
# -----------------------------
from rest_framework.views import APIView
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta

class DashboardAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # This is a mock implementation. In a real app, you would aggregate real data.
        # We'll use some real counts where possible.
        
        # Import models here to avoid circular imports if any
        from apps.accounts.models import CustomUser
        from apps.services.models import Service
        from apps.portfolio.models import PortfolioItem
        
        total_users = CustomUser.objects.count()
        total_services = Service.objects.count()
        total_portfolio = PortfolioItem.objects.count()
        
        # Mock data for charts
        last_7_days = [(timezone.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7)][::-1]
        
        return Response({
            'stats': {
                'total_users': total_users,
                'total_orders': 150,  # Mock
                'total_revenue': 15000000,  # Mock
                'active_services': total_services,
            },
            'charts': {
                'revenue': {
                    'labels': last_7_days,
                    'data': [1200000, 1500000, 800000, 2000000, 1800000, 2500000, 3000000]
                },
                'orders': {
                    'labels': last_7_days,
                    'data': [5, 8, 3, 10, 7, 12, 15]
                }
            }
        })

class ServicesAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from apps.services.models import Service
        services = Service.objects.annotate(views_count=Count('id')).values('title', 'views_count') # Mock annotation
        
        return Response({
            'popular_services': [
                {'name': s['title'], 'views': s['views_count'] * 10 + 50} for s in services
            ],
            'category_distribution': {
                'labels': ['طراحی', 'چاپ', 'دیجیتال'],
                'data': [40, 35, 25]
            }
        })

class OrdersAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            'recent_orders': [],
            'status_distribution': {
                'pending': 10,
                'processing': 5,
                'completed': 100,
                'cancelled': 2
            }
        })


# -----------------------------
# Company Settings ViewSet
# -----------------------------
from .models import CompanySettings
from .serializers import CompanySettingsSerializer

class CompanySettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet برای مدیریت تنظیمات شرکت
    فقط یک رکورد (singleton) وجود دارد
    """
    queryset = CompanySettings.objects.all()
    serializer_class = CompanySettingsSerializer
    permission_classes = [IsAdminUser]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]
    
    def list(self, request):
        """دریافت تنظیمات شرکت"""
        settings = CompanySettings.get_settings()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """دریافت تنظیمات شرکت با ID"""
        settings = CompanySettings.get_settings()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        """به‌روزرسانی تنظیمات شرکت"""
        settings = CompanySettings.get_settings()
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# -----------------------------
# Uploaded File ViewSet
# -----------------------------
from .models import UploadedFile
from .serializers import UploadedFileSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class UploadedFileViewSet(viewsets.ModelViewSet):
    """
    ViewSet برای مدیریت فایل‌های آپلود شده
    """
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileSerializer
    permission_classes = [IsAdminUser]
    parser_classes = (MultiPartParser, FormParser)
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return UploadedFile.objects.all()
        return UploadedFile.objects.filter(uploaded_by=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
