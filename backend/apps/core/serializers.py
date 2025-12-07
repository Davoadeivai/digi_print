from rest_framework import serializers
from .models import NewsletterSubscriber, CompanySettings, UploadedFile

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'is_active', 'subscribed_at']
        read_only_fields = ['subscribed_at', 'is_active']


class CompanySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanySettings
        fields = [
            'id', 'name', 'description', 'about', 'phone', 'email',
            'address', 'working_hours', 'social_media', 'logo',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UploadedFileSerializer(serializers.ModelSerializer):
    uploaded_by_email = serializers.EmailField(source='uploaded_by.email', read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UploadedFile
        fields = [
            'id', 'file', 'file_url', 'folder', 'original_name',
            'file_size', 'file_type', 'uploaded_by', 'uploaded_by_email',
            'is_public', 'created_at'
        ]
        read_only_fields = ['uploaded_by', 'file_size', 'original_name', 'created_at']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
