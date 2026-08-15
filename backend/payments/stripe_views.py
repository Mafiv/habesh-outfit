from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings

from payments.stripe_service import (
    stripe_enabled,
    create_setup_intent,
    sync_stripe_payment_methods,
)


class StripeConfigView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({
            'stripeEnabled': stripe_enabled(),
            'publishableKey': settings.STRIPE_PUBLISHABLE_KEY,
        })


class SetupIntentView(APIView):
    def post(self, request):
        if not stripe_enabled():
            return Response(
                {'detail': 'Stripe is not configured.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        try:
            result = create_setup_intent(
                str(request.user.id),
                getattr(request.user, 'email', ''),
                getattr(request.user, 'name', ''),
            )
        except RuntimeError as exc:
            return Response({'detail': str(exc)}, status=503)
        except Exception as exc:
            return Response({'detail': str(exc)}, status=502)
        return Response(result)


class SyncPaymentMethodsView(APIView):
    def post(self, request):
        if not stripe_enabled():
            return Response(
                {'detail': 'Stripe is not configured.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        methods = sync_stripe_payment_methods(str(request.user.id))
        return Response([m.to_dict() for m in methods])
