from django.urls import path, include
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import mongoengine

from orders.admin_views import AdminOrderStatusView


@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    mongo_status = 'ok'
    try:
        conn = mongoengine.connection.get_connection()
        conn.admin.command('ping')
    except Exception as exc:
        mongo_status = f'error: {exc}'

    overall = 'ok' if mongo_status == 'ok' else 'degraded'
    status_code = 200 if overall == 'ok' else 503
    return Response(
        {
            'status': overall,
            'service': 'django-api',
            'mongodb': mongo_status,
        },
        status=status_code,
    )


urlpatterns = [
    path('health/', health),
    path('catalog/', include('catalog.urls')),
    path('', include('orders.urls')),
    path('payments/', include('payments.urls')),
    path('admin/orders/<str:pk>/', AdminOrderStatusView.as_view()),
]
