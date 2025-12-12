from . import views
from django.urls import path

urlpatterns = [
    path('', views.PortfolioListAPIView.as_view(), name='portfolio-list'),
    path('<int:pk>/', views.PortfolioDetailAPIView.as_view(), name='portfolio-detail'),
]