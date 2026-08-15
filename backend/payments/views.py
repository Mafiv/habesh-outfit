import stripe
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from bson import ObjectId

from orders.models import Order
from orders.services import (
    PROMO_CODES,
    calculate_totals,
    create_pending_order,
    complete_order_payment,
    cancel_pending_order,
    validate_promocode,
)


stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    def post(self, request):
        if not settings.STRIPE_SECRET_KEY:
            return Response(
                {'detail': 'Stripe is not configured. Set STRIPE_SECRET_KEY.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        data = request.data
        items = data.get('items', [])
        if not items:
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        promocode = data.get('promocode', '')
        address_id = data.get('addressId')
        user_id = str(request.user.id)

        try:
            order = create_pending_order(user_id, items, promocode, address_id)
        except ValueError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        totals = calculate_totals(items, promocode)
        discount_rate = totals['discountRate']

        line_items = []
        for item in items:
            unit_amount = int(item['price'] * 100)
            if discount_rate:
                unit_amount = int(unit_amount * (1 - discount_rate))
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': item['title'],
                        'metadata': {
                            'product_id': item.get('productId', ''),
                            'size': item.get('size', ''),
                        },
                    },
                    'unit_amount': max(unit_amount, 50),
                },
                'quantity': item.get('quantity', 1),
            })

        if totals['shipping'] > 0:
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': 'Shipping'},
                    'unit_amount': int(totals['shipping'] * 100),
                },
                'quantity': 1,
            })

        try:
            from payments.stripe_service import get_or_create_stripe_customer

            customer_id = get_or_create_stripe_customer(
                user_id,
                getattr(request.user, 'email', ''),
                getattr(request.user, 'name', ''),
            )
            session_kwargs = {
                'mode': 'payment',
                'line_items': line_items,
                'success_url': f'{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}',
                'cancel_url': f'{settings.FRONTEND_URL}/bag',
                'metadata': {
                    'user_id': user_id,
                    'order_id': str(order.id),
                    'promocode': promocode.upper(),
                },
            }
            if customer_id:
                session_kwargs['customer'] = customer_id

            session = stripe.checkout.Session.create(**session_kwargs)
        except stripe.error.StripeError as exc:
            cancel_pending_order(order)
            return Response({'detail': str(exc)}, status=status.HTTP_502_BAD_GATEWAY)

        order.stripe_session_id = session.id
        order.save()

        return Response({
            'sessionId': session.id,
            'url': session.url,
            'orderId': str(order.id),
        })


class StripeWebhookView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')

        if not settings.STRIPE_WEBHOOK_SECRET:
            return Response({'detail': 'Webhook secret not configured.'}, status=503)

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.error.SignatureVerificationError):
            return Response({'detail': 'Invalid payload.'}, status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            order_id = session.get('metadata', {}).get('order_id')
            customer_email = (
                session.get('customer_details', {}).get('email')
                or session.get('customer_email')
                or ''
            )
            if order_id and ObjectId.is_valid(order_id):
                try:
                    order = Order.objects.get(id=ObjectId(order_id))
                    complete_order_payment(order, session, customer_email)
                except Order.DoesNotExist:
                    pass

        elif event['type'] == 'checkout.session.expired':
            session = event['data']['object']
            order_id = session.get('metadata', {}).get('order_id')
            if order_id and ObjectId.is_valid(order_id):
                try:
                    order = Order.objects.get(id=ObjectId(order_id))
                    cancel_pending_order(order)
                except Order.DoesNotExist:
                    pass

        return Response({'status': 'ok'})


class PromocodesView(APIView):
    def get(self, request):
        return Response([
            {
                'code': code,
                'discount': rate,
                'description': f'{int(rate * 100)}% off your order',
                'expiresAt': '2026-12-31',
            }
            for code, rate in PROMO_CODES.items()
        ])


class ValidatePromocodeView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        code = request.data.get('code', '')
        result = validate_promocode(code)
        if not result['valid']:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result)
