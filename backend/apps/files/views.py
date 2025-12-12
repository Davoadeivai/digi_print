from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class FileUploadAPIView(APIView):
    parser_classes = []

    def post(self, request):
        # Minimal implementation: if file present, return a placeholder URL
        f = None
        # Try common keys
        for k in ('file', 'upload', 'image'):
            f = request.FILES.get(k) if hasattr(request, 'FILES') else None
            if f:
                break

        if not f:
            return Response({'error': 'file not provided'}, status=status.HTTP_400_BAD_REQUEST)

        # In a full implementation we'd save the file to a storage backend
        return Response({'url': f'/media/uploads/{f.name}'}, status=status.HTTP_201_CREATED)
