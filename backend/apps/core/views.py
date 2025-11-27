"""
Core app views
"""
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET"])
def health_check(request):
    """
    Health check endpoint for monitoring services like Render
    Returns a simple JSON response indicating the service is running
    """
    return JsonResponse({"status": "ok", "message": "Service is healthy"}, status=200)
