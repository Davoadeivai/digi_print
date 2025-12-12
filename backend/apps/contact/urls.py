from django.urls import path
from . import views

urlpatterns = [
    path('', views.ContactCreateAPIView.as_view(), name='contact-create'),
]
