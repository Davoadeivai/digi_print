from rest_framework import serializers
from .models import QuoteRequest, Order

class QuoteRequestSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = QuoteRequest
        fields = [
            'id', 'user', 'customer_name', 'customer_email', 'customer_phone',
            'service_type', 'project_details', 'budget_range', 'deadline',
            'files', 'special_requirements', 'status', 'status_display',
            'admin_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'status', 'admin_notes', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Assign the current user to the order
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'product',
            'quantity',
            'total_price',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
