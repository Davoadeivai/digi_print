from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.DashboardAnalyticsView.as_view(), name='analytics-dashboard'),
    path('services/', views.ServicesAnalyticsView.as_view(), name='analytics-services'),
    path('orders/', views.OrdersAnalyticsView.as_view(), name='analytics-orders'),
]
