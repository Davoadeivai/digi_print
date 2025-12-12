from django.urls import path
from .views import (
    CategoryListAPIView,
    CategoryDetailAPIView,
    CategoryProductsAPIView,
)

urlpatterns = [
    path('', CategoryListAPIView.as_view(), name='category-list'),
    path('<slug:slug>/', CategoryDetailAPIView.as_view(), name='category-detail'),
    path('<slug:slug>/products/', CategoryProductsAPIView.as_view(), name='category-products'),
]
