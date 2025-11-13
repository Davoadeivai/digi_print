"""
میدلورهای سفارشی
"""
import logging
from django.utils.deprecation import MiddlewareMixin
from django.utils.timezone import now

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    میدلور برای لاگ کردن درخواست‌ها
    """
    
    def process_request(self, request):
        """لاگ کردن اطلاعات درخواست"""
        request.start_time = now()
        logger.info(f'Request: {request.method} {request.path}')
        return None
    
    def process_response(self, request, response):
        """لاگ کردن پاسخ و زمان پردازش"""
        if hasattr(request, 'start_time'):
            duration = (now() - request.start_time).total_seconds()
            logger.info(
                f'Response: {request.method} {request.path} '
                f'[{response.status_code}] - {duration:.2f}s'
            )
        return response


class UserActivityMiddleware(MiddlewareMixin):
    """
    میدلور برای ثبت فعالیت کاربران
    """
    
    def process_request(self, request):
        """بروزرسانی آخرین فعالیت کاربر"""
        if request.user.is_authenticated:
            # بروزرسانی last_login
            from django.contrib.auth import get_user_model
            User = get_user_model()
            User.objects.filter(pk=request.user.pk).update(last_login=now())
        return None


class IPAddressMiddleware(MiddlewareMixin):
    """
    میدلور برای دریافت IP واقعی کاربر
    """
    
    def process_request(self, request):
        """افزودن IP واقعی به request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        request.real_ip = ip
        return None


class MaintenanceModeMiddleware(MiddlewareMixin):
    """
    میدلور برای فعال کردن حالت تعمیر و نگهداری
    """
    
    def process_request(self, request):
        """بررسی حالت تعمیر"""
        from django.conf import settings
        from django.http import HttpResponse
        
        # اگر در حالت تعمیر بود و کاربر staff نبود
        if getattr(settings, 'MAINTENANCE_MODE', False):
            if not request.user.is_staff:
                return HttpResponse(
                    'سایت در حال تعمیر و نگهداری است. لطفا بعدا مراجعه کنید.',
                    status=503
                )
        return None
