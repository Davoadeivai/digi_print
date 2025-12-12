from .views import FileUploadAPIView
from django.urls import path

urlpatterns = [
    path('upload/', FileUploadAPIView.as_view(), name='file-upload'),
]