from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

schema_view = get_schema_view(
   openapi.Info(
      title="Daidi Print API",
      default_version='v1',
      description="API documentation for Daidi Print",
      terms_of_service="https://www.daidi-print.com/terms/",
      contact=openapi.Contact(email="contact@daidi-print.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)
router = DefaultRouter()
urlpatterns = [
    path('v1/', include([
        path('auth/', include('rest_framework.urls')),
        path('token/obtain/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('accounts/', include('apps.accounts.urls')),
        path('products/', include('apps.products.urls')),
        path('categories/', include('apps.products.category_urls')),
        path('files/', include('apps.files.urls')),
        path('services/', include('apps.services.urls')),
        path('portfolio/', include('apps.portfolio.urls')),
        path('orders/', include('apps.orders.urls')),
        path('contact/', include('apps.contact.urls')),
        path('', include(router.urls)),
    ])),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]