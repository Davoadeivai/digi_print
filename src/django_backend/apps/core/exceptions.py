# apps/core/exceptions.py
"""
Custom exception handlers برای Django REST Framework
"""

from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.http import Http404


def custom_exception_handler(exc, context):
    """
    Custom exception handler که خطاها را به صورت استاندارد برمی‌گرداند
    
    Format:
    {
        "error": "خطا رخ داد",
        "details": {...},
        "status_code": 400
    }
    """
    
    # ابتدا از exception handler پیش‌فرض استفاده می‌کنیم
    response = drf_exception_handler(exc, context)
    
    if response is not None:
        # فرمت کردن خطاها
        custom_response_data = {
            'error': True,
            'message': 'خطا رخ داد',
            'details': response.data,
            'status_code': response.status_code
        }
        
        # اگر یک پیام ساده است
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                custom_response_data['message'] = response.data['detail']
            elif 'non_field_errors' in response.data:
                custom_response_data['message'] = response.data['non_field_errors'][0]
        
        response.data = custom_response_data
        
        return response
    
    # خطاهای Django که توسط DRF هندل نشده‌اند
    if isinstance(exc, Http404):
        return Response(
            {
                'error': True,
                'message': 'یافت نشد',
                'details': {'detail': 'منبع درخواستی یافت نشد.'},
                'status_code': status.HTTP_404_NOT_FOUND
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
    if isinstance(exc, ValidationError):
        return Response(
            {
                'error': True,
                'message': 'خطای اعتبارسنجی',
                'details': {'validation_errors': exc.messages},
                'status_code': status.HTTP_400_BAD_REQUEST
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # خطاهای کلی
    return Response(
        {
            'error': True,
            'message': 'خطای سرور',
            'details': {'detail': str(exc)},
            'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


class APIException(Exception):
    """کلاس پایه برای exception های سفارشی"""
    
    def __init__(self, message, status_code=status.HTTP_400_BAD_REQUEST, details=None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class PermissionDenied(APIException):
    """عدم دسترسی"""
    
    def __init__(self, message='شما اجازه دسترسی به این منبع را ندارید.'):
        super().__init__(message, status.HTTP_403_FORBIDDEN)


class NotFound(APIException):
    """یافت نشد"""
    
    def __init__(self, message='منبع درخواستی یافت نشد.'):
        super().__init__(message, status.HTTP_404_NOT_FOUND)


class ValidationException(APIException):
    """خطای اعتبارسنجی"""
    
    def __init__(self, message='داده‌های ارسالی نامعتبر است.', details=None):
        super().__init__(message, status.HTTP_400_BAD_REQUEST, details)
