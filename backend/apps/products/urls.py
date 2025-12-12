from django.urls import path
from .views import (
    ProductListAPIView,
    ProductDetailAPIView,
    CalculatePriceAPIView,
    ReviewsAPIView,
)

urlpatterns = [
    path('', ProductListAPIView.as_view(), name='product-list'),
    path('<slug:slug>/', ProductDetailAPIView.as_view(), name='product-detail'),
    path('<str:product_id>/calculate_price/', CalculatePriceAPIView.as_view(), name='product-calculate-price'),
    path('<str:product_id>/reviews/', ReviewsAPIView.as_view(), name='product-reviews'),
]
