from . import views
from django.urls import path

urlpatterns = [
    path('', views.ContactCreateAPIView.as_view(), name='contact-create'),
]