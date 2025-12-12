from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class ContactCreateAPIView(APIView):
    def post(self, request):
        # Accepts contact form data; if a model exists it can be saved later
        payload = request.data
        # Minimal validation
        if not payload.get('message'):
            return Response({'error': 'message is required'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status': 'received', 'data': payload}, status=status.HTTP_201_CREATED)
