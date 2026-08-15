"""Stripe customer and payment method helpers."""

import stripe
from django.conf import settings

from orders.models import PaymentMethod
from payments.models import StripeProfile


stripe.api_key = settings.STRIPE_SECRET_KEY


def stripe_enabled() -> bool:
    return bool(settings.STRIPE_SECRET_KEY)


def get_or_create_stripe_customer(user_id: str, email: str, name: str = '') -> str | None:
    if not stripe_enabled():
        return None

    profile = StripeProfile.objects.filter(user_id=user_id).first()
    if profile:
        return profile.stripe_customer_id

    customer = stripe.Customer.create(
        email=email or None,
        name=name or None,
        metadata={'user_id': user_id},
    )
    StripeProfile(user_id=user_id, stripe_customer_id=customer.id, email=email).save()
    return customer.id


def create_setup_intent(user_id: str, email: str, name: str = '') -> dict:
    customer_id = get_or_create_stripe_customer(user_id, email, name)
    if not customer_id:
        raise RuntimeError('Stripe is not configured')

    intent = stripe.SetupIntent.create(
        customer=customer_id,
        payment_method_types=['card'],
        metadata={'user_id': user_id},
    )
    return {'clientSecret': intent.client_secret, 'customerId': customer_id}


def sync_stripe_payment_methods(user_id: str) -> list[PaymentMethod]:
    profile = StripeProfile.objects.filter(user_id=user_id).first()
    if not profile or not stripe_enabled():
        return list(PaymentMethod.objects.filter(user_id=user_id))

    stripe_methods = stripe.PaymentMethod.list(
        customer=profile.stripe_customer_id,
        type='card',
    )

    seen_ids: set[str] = set()
    synced: list[PaymentMethod] = []

    for idx, pm in enumerate(stripe_methods.data):
        stripe_pm_id = pm.id
        seen_ids.add(stripe_pm_id)
        card = pm.card
        brand = (card.brand or 'card').title()
        last4 = card.last4 or '****'

        existing = PaymentMethod.objects.filter(
            user_id=user_id,
            stripe_payment_method_id=stripe_pm_id,
        ).first()

        if existing:
            existing.label = f'{brand} ending in {last4}'
            existing.last4 = last4
            existing.brand = brand
            existing.type = 'card'
            existing.save()
            synced.append(existing)
        else:
            method = PaymentMethod(
                user_id=user_id,
                type='card',
                label=f'{brand} ending in {last4}',
                last4=last4,
                brand=brand,
                stripe_payment_method_id=stripe_pm_id,
                is_default=idx == 0 and not PaymentMethod.objects.filter(user_id=user_id).count(),
            )
            method.save()
            synced.append(method)

    for local in PaymentMethod.objects.filter(user_id=user_id):
        if local.stripe_payment_method_id and local.stripe_payment_method_id not in seen_ids:
            local.delete()

    return list(PaymentMethod.objects.filter(user_id=user_id))


def detach_stripe_payment_method(user_id: str, method: PaymentMethod) -> None:
    if method.stripe_payment_method_id and stripe_enabled():
        try:
            stripe.PaymentMethod.detach(method.stripe_payment_method_id)
        except stripe.error.StripeError:
            pass
    method.delete()


def get_stripe_customer_id(user_id: str) -> str | None:
    profile = StripeProfile.objects.filter(user_id=user_id).first()
    return profile.stripe_customer_id if profile else None
