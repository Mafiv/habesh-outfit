import stripe
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from orders.models import Order
from bson import ObjectId


stripe.api_key = settings.STRIPE_SECRET_KEY

PROMO_CODES = {
    'SAVE10': 0.10,
    'STYLE20': 0.20,
    'WELCOME15': 0.15,
}


class CreateCheckoutSessionView(APIView):
    def post(self, request):
        if not settings.STRIPE_SECRET_KEY:
            return Response(
                {'detail': 'Stripe is not configured. Set STRIPE_SECRET_KEY.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        data = request.data
        items = data.get('items', [])
        promocode = data.get('promocode', '').upper()
        discount_rate = PROMO_CODES.get(promocode, 0)

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

        subtotal = sum(i['price'] * i.get('quantity', 1) for i in items)
        shipping = 0 if subtotal > 50 else 999

        if shipping:
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': 'Shipping'},
                    'unit_amount': shipping,
                },
                'quantity': 1,
            })

        session = stripe.checkout.Session.create(
            mode='payment',
            line_items=line_items,
            success_url=f'{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{settings.FRONTEND_URL}/bag',
            metadata={
                'user_id': str(request.user.id),
                'promocode': promocode,
            },
        )

        return Response({
            'sessionId': session.id,
            'url': session.url,
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
            if order_id and ObjectId.is_valid(order_id):
                try:
                    order = Order.objects.get(id=ObjectId(order_id))
                    order.stripe_session_id = session['id']
                    order.stripe_payment_intent = session.get('payment_intent', '')
                    order.status = 'shipped'
                    order.save()
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
