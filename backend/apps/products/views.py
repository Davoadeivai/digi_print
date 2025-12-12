from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductSerializer, CategorySerializer, ReviewSerializer


class ProductListAPIView(APIView):
    def get(self, request):
        # Return an empty paginated structure so frontend can handle it
        return Response({
            'count': 0,
            'next': None,
            'previous': None,
            'results': [],
        })


class ProductDetailAPIView(APIView):
    def get(self, request, slug):
        # If a Product model exists it will be hooked later; for now return 404
        return Response({'detail': 'محصول یافت نشد'}, status=status.HTTP_404_NOT_FOUND)


class CalculatePriceAPIView(APIView):
    def post(self, request, product_id):
        # Simple, safe price calculation fallback used when backend model logic is missing
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
        # If a Review model existed we'd save it; return submitted payload as created
        return Response({'id': None, **serializer.validated_data}, status=status.HTTP_201_CREATED)


class CategoryListAPIView(APIView):
    def get(self, request):
        # Return an empty paginated structure so frontend can render categories
        return Response({
            'count': 0,
            'next': None,
            'previous': None,
            'results': [],
        })


class CategoryDetailAPIView(APIView):
    def get(self, request, slug):
        # Return a minimal category representation so frontend can render
        return Response({'id': None, 'name': slug.replace('-', ' ').title(), 'slug': slug})


class CategoryProductsAPIView(APIView):
    def get(self, request, slug):
        # Return an empty paginated products list for the category
        return Response({
            'count': 0,
            'next': None,
            'previous': None,
            'results': [],
        })
