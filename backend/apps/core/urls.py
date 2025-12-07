from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
# Note: We don't register 'newsletter' directly because we want custom paths
# But we can register it to get standard CRUD for admin
router.register(r'subscribers', views.NewsletterSubscriberViewSet, basename='newsletter-subscriber')
router.register(r'company', views.CompanySettingsViewSet, basename='company-settings')
router.register(r'files', views.UploadedFileViewSet, basename='uploaded-file')

urlpatterns = [
    path('', include(router.urls)),
    path('subscribe/', views.NewsletterSubscriberViewSet.as_view({'post': 'subscribe'}), name='newsletter-subscribe'),
    path('unsubscribe/', views.NewsletterSubscriberViewSet.as_view({'post': 'unsubscribe'}), name='newsletter-unsubscribe'),
]
