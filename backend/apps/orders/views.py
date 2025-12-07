from rest_framework import viewsets, permissions, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import QuoteRequest, Order
from .serializers import QuoteRequestSerializer, OrderSerializer

class QuoteRequestViewSet(viewsets.ModelViewSet):
    serializer_class = QuoteRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'service_type']
    search_fields = ['customer_name', 'project_details', 'id']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return QuoteRequest.objects.all()
        return QuoteRequest.objects.filter(user=user)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status in ['pending', 'confirmed']:
            order.status = 'cancelled'
            order.save()
            return Response({'status': 'سفارش لغو شد'})
        return Response(
            {'error': 'نمی‌توان این سفارش را لغو کرد'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['post'])
    def track(self, request, pk=None):
        order = self.get_object()
        return Response({
            'order_id': order.id,
            'status': order.status,
            'created_at': order.created_at,
            'updated_at': order.updated_at
        })
