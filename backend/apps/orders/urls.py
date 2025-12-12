from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderViewSet.as_view({'get': 'list', 'post': 'create'}), name='order-list'),
    path('<int:pk>/', views.OrderViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='order-detail'),
    path('<int:pk>/cancel/', views.OrderViewSet.as_view({'post': 'cancel'}), name='order-cancel'),
]
