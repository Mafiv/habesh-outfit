from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from bson import ObjectId
from bson.errors import InvalidId

from orders.models import Order


VALID_STATUSES = [
    'pending_payment',
    'processing',
    'shipped',
    'in_transit',
    'delivered',
    'cancelled',
]


class AdminOrderStatusView(APIView):
    """Update order status using X-Admin-Key header."""
    permission_classes = [AllowAny]
    authentication_classes = []

    def patch(self, request, pk):
        admin_key = settings.ADMIN_API_KEY
        if not admin_key:
            return Response({'detail': 'Admin API not configured.'}, status=503)

        if request.headers.get('X-Admin-Key') != admin_key:
            return Response({'detail': 'Unauthorized.'}, status=401)

        new_status = request.data.get('status')
        if new_status not in VALID_STATUSES:
            return Response(
                {'detail': f'Invalid status. Choose from: {", ".join(VALID_STATUSES)}'},
                status=400,
            )

        try:
            order = Order.objects.get(id=ObjectId(pk))
        except (Order.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)

        order.status = new_status
        if request.data.get('trackingNumber'):
            order.tracking_number = request.data['trackingNumber']
        order.save()

        return Response(order.to_dict())
