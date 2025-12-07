from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import PortfolioItem
from .serializers import PortfolioItemSerializer, PortfolioItemListSerializer

class PortfolioItemViewSet(viewsets.ModelViewSet):
    queryset = PortfolioItem.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'client', 'category']
    ordering_fields = ['created_at', 'year', 'is_featured']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return PortfolioItemListSerializer
        return PortfolioItemSerializer
