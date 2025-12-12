from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class ContactCreateAPIView(APIView):
    def post(self, request):
        payload = request.data
        if not payload.get('message'):
            return Response({'error': 'message is required'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status': 'received', 'data': payload}, status=status.HTTP_201_CREATED)