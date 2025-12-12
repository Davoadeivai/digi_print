from rest_framework import serializers

class ProductSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()
    slug = serializers.CharField(required=False)
    price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False)
class CategorySerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()
    slug = serializers.CharField(required=False)
class ReviewSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    user = serializers.CharField(required=False)
    rating = serializers.IntegerField()
    comment = serializers.CharField(allow_blank=True, required=False)
    created_at = serializers.DateTimeField(required=False)