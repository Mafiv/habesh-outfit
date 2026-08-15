from django.urls import path, include
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    return Response({'status': 'ok', 'service': 'django-api'})


urlpatterns = [
    path('health/', health),
    path('catalog/', include('catalog.urls')),
    path('', include('orders.urls')),
    path('payments/', include('payments.urls')),
]
