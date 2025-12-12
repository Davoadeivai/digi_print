from rest_framework.views import APIView
from rest_framework.response import Response


class PortfolioListAPIView(APIView):
    def get(self, request):
        return Response({'count': 0, 'results': []})


class PortfolioDetailAPIView(APIView):
    def get(self, request, pk):
        return Response({'detail': 'یافت نشد'}, status=404)
