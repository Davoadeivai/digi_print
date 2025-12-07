# config/urls.py
"""
URL Configuration for DigiChapograph project
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from django.views.generic import TemplateView
from apps.core.views import health_check

# تنظیمات پنل ادمین
admin.site.site_header = "دیجی چاپ و گرافیک - پنل مدیریت"
admin.site.site_title = "دیجی چاپ و گرافیک"
admin.site.index_title = "خوش آمدید به پنل مدیریت"

urlpatterns = [
    # Health check for monitoring (Render, etc.)
    path('api/health/', health_check, name='health_check'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/accounts/', include('apps.accounts.urls')),
    path('api/v1/', include('apps.products.urls')),
    path('api/v1/orders/', include('apps.orders.urls')),
    path('api/v1/services/', include('apps.services.urls')),
    path('api/v1/portfolio/', include('apps.portfolio.urls')),
    path('api/v1/contact/', include('apps.contact.urls')),
    path('api/v1/newsletter/', include('apps.core.urls')),
    path('api/v1/company/', include('apps.core.urls')),  # Company settings
    path('api/v1/files/', include('apps.core.urls')),  # File upload
    path('api/v1/wallet/', include('apps.accounts.wallet_urls')),
    path('api/v1/analytics/', include('apps.core.analytics_urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

from django.http import JsonResponse

def api_root(request):
    return JsonResponse({"message": "DigiChapograph API is running. Access endpoints at /api/v1/"})

# Serve root URL
urlpatterns += [
    path('', api_root, name='api_root'),
]
