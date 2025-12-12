from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include
from django.views.generic import RedirectView

def home_view(request):
    return HttpResponse("""
    <h1>Welcome to Daidi Print</h1>
    <p>The site is under construction.</p>
    <p>API Documentation: <a href='/api/swagger/'>Swagger UI</a> | <a href='/api/redoc/'>ReDoc</a></p>
    <p>Admin Panel: <a href='/admin/'>Django Admin</a></p>
    """)
urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('config.api_urls')),
    path('api', RedirectView.as_view(url='/api/swagger/', permanent=False)),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)