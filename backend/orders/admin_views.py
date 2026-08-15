from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from bson import ObjectId
from bson.errors import InvalidId

from orders.models import Order
from catalog.models import Product


VALID_STATUSES = [
    'pending_payment',
    'processing',
    'shipped',
    'in_transit',
    'delivered',
    'cancelled',
]


def check_admin(request) -> Response | None:
    admin_key = settings.ADMIN_API_KEY
    if not admin_key:
        return Response({'detail': 'Admin API not configured.'}, status=503)
    if request.headers.get('X-Admin-Key') != admin_key:
        return Response({'detail': 'Unauthorized.'}, status=401)
    return None


class AdminOrderListView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        auth_error = check_admin(request)
        if auth_error:
            return auth_error

        status_filter = request.query_params.get('status')
        qs = Order.objects.all().order_by('-created_at')
        if status_filter:
            qs = qs.filter(status=status_filter)

        return Response([o.to_dict() for o in qs[:200]])


class AdminOrderStatusView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def patch(self, request, pk):
        auth_error = check_admin(request)
        if auth_error:
            return auth_error

        new_status = request.data.get('status')
        if new_status and new_status not in VALID_STATUSES:
            return Response(
                {'detail': f'Invalid status. Choose from: {", ".join(VALID_STATUSES)}'},
                status=400,
            )

        try:
            order = Order.objects.get(id=ObjectId(pk))
        except (Order.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)

        if new_status:
            order.status = new_status
        if request.data.get('trackingNumber'):
            order.tracking_number = request.data['trackingNumber']
        order.save()

        return Response(order.to_dict())


class AdminProductListView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        auth_error = check_admin(request)
        if auth_error:
            return auth_error

        products = Product.objects.all().order_by('title')
        return Response([p.to_dict() for p in products])


class AdminProductUpdateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def patch(self, request, pk):
        auth_error = check_admin(request)
        if auth_error:
            return auth_error

        try:
            product = Product.objects.get(id=ObjectId(pk))
        except (Product.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)

        if 'stock' in request.data:
            product.stock = max(0, int(request.data['stock']))
        if 'price' in request.data:
            product.price = float(request.data['price'])
        product.save()

        return Response(product.to_dict())
