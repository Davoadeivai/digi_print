from .models import Service
from .serializers import ServiceSerializer
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

class ServiceViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing service instances.
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    def get_queryset(self):
        """
        Optionally filter by 'is_active' flag.
        """
        queryset = Service.objects.all()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            is_active = is_active.lower() in ('true', '1', 't')
            queryset = queryset.filter(is_active=is_active)
        return queryset
    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Return a list of all active services.
        """
        active_services = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_services, many=True)
        return Response(serializer.data)