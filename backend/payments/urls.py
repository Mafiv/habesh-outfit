from django.urls import path
from payments.views import (
    CreateCheckoutSessionView,
    StripeWebhookView,
    PromocodesView,
    ValidatePromocodeView,
)
from payments.stripe_views import StripeConfigView, SetupIntentView, SyncPaymentMethodsView

urlpatterns = [
    path('config/', StripeConfigView.as_view()),
    path('setup-intent/', SetupIntentView.as_view()),
    path('sync-payment-methods/', SyncPaymentMethodsView.as_view()),
    path('create-checkout-session/', CreateCheckoutSessionView.as_view()),
    path('webhook/', StripeWebhookView.as_view()),
    path('promocodes/', PromocodesView.as_view()),
    path('validate-promocode/', ValidatePromocodeView.as_view()),
]
