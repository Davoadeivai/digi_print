from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# We use a custom router or manual paths because WalletViewSet is a GenericViewSet
# designed to work on a single object (the user's wallet)

urlpatterns = [
    path('', views.WalletViewSet.as_view({'get': 'list'}), name='wallet-info'),
    path('charge/', views.WalletViewSet.as_view({'post': 'charge'}), name='wallet-charge'),
    path('transactions/', views.WalletViewSet.as_view({'get': 'transactions'}), name='wallet-transactions'),
]
