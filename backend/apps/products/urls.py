from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# ایجاد Router برای ViewSets
router = DefaultRouter()
router.register(r'categories', views.ProductCategoryViewSet, basename='category')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'papers', views.PaperTypeViewSet, basename='paper')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'upload', views.UploadedFileViewSet, basename='upload')

app_name = 'products'

urlpatterns = [
    # API endpoints از ViewSets
    path('', include(router.urls)),
    
    # API endpoints جداگانه
    path('calculator/', views.price_calculator, name='price_calculator'),
    path('home/', views.home_data, name='home_data'),
    path('navigation/', views.navigation_data, name='navigation_data'),
    path('info/', views.api_info, name='api_info'),
    
    # Product specific endpoints
    path('products/featured/', views.ProductViewSet.as_view({'get': 'featured'}), name='featured_products'),
    path('products/search/', views.ProductViewSet.as_view({'get': 'search'}), name='search_products'),
    
    # Order specific endpoints
    path('orders/user/', views.OrderViewSet.as_view({'get': 'user_orders'}), name='user_orders'),
    
    # File upload endpoints
    path('files/assign-to-order/', views.UploadedFileViewSet.as_view({'post': 'assign_to_order'}), name='assign_file_to_order'),
]
