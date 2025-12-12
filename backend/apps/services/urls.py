from django.urls import path
from . import views

app_name = 'services'

urlpatterns = [
    path('', views.ServiceViewSet.as_view({'get': 'list', 'post': 'create'}), name='service-list'),
    path('active/', views.ServiceViewSet.as_view({'get': 'active'}), name='service-active'),
    path('<slug:slug>/', views.ServiceViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='service-detail'),
]
