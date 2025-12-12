from .serializers import ProductSerializer, CategorySerializer, ReviewSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class ProductListAPIView(APIView):
    def get(self, request):
        return Response({
            'count': 0,
            'next': None,
            'previous': None,
            'results': [],
        })
class ProductDetailAPIView(APIView):
    def get(self, request, slug):
        return Response({'detail': 'محصول یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
class CalculatePriceAPIView(APIView):
    def post(self, request, product_id):
        data = request.data or {}
        quantity = int(data.get('quantity', 1))
        base_price = float(data.get('base_price', 0) or 0)
        unit_price = base_price
        total = round(unit_price * quantity, 2)
        return Response({'unit_price': unit_price, 'quantity': quantity, 'total_price': total})
class ReviewsAPIView(APIView):
    def post(self, request, product_id):
        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'id': None, **serializer.validated_data}, status=status.HTTP_201_CREATED)
class CategoryListAPIView(APIView):
    def get(self, request):
        return Response({
            'count': 0,
            'next': None,
            'previous': None,
            'results': [],
        })
class CategoryDetailAPIView(APIView):
    def get(self, request, slug):
        return Response({'id': None, 'name': slug.replace('-', ' ').title(), 'slug': slug})
class CategoryProductsAPIView(APIView):
    def get(self, request, slug):
        return Response({
            'count': 0,
            'next': None,
            'previous': None,
            'results': [],
        })