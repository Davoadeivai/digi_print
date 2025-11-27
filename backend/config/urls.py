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
    # path('api/v1/orders/', include('apps.orders.urls')),
    # path('api/v1/services/', include('apps.services.urls')),
    # path('api/v1/portfolio/', include('apps.portfolio.urls')),
    # path('api/v1/contact/', include('apps.contact.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# همهٔ مسیرهای غیر admin و غیر api را به React (index.html) بده
urlpatterns += [
    re_path(r'^(?!admin/|api/).*$', TemplateView.as_view(template_name="index.html"), name='frontend'),
]
