from django.urls import path
from payments.views import (
    CreateCheckoutSessionView,
    StripeWebhookView,
    PromocodesView,
    ValidatePromocodeView,
)

urlpatterns = [
    path('create-checkout-session/', CreateCheckoutSessionView.as_view()),
    path('webhook/', StripeWebhookView.as_view()),
    path('promocodes/', PromocodesView.as_view()),
    path('validate-promocode/', ValidatePromocodeView.as_view()),
]
