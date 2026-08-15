"""Transactional email helpers."""

from django.conf import settings
from django.core.mail import send_mail


def send_order_confirmation(order, recipient_email: str) -> None:
    if not recipient_email:
        return

    items_text = '\n'.join(
        f"  - {item.title} x{item.quantity} (${item.price * item.quantity:.2f})"
        for item in order.items
    )
    address = order.address
    address_text = (
        f"{address.name}\n{address.address}\n{address.city}, {address.zip}"
        if address
        else 'No address on file'
    )

    subject = f'Order confirmed — {order.to_dict()["id"]}'
    message = (
        f"Thank you for your order!\n\n"
        f"Order: {order.to_dict()['id']}\n"
        f"Tracking: {order.tracking_number}\n"
        f"Status: {order.status}\n\n"
        f"Items:\n{items_text}\n\n"
        f"Subtotal: ${order.subtotal:.2f}\n"
        f"Discount: -${order.discount:.2f}\n"
        f"Shipping: ${order.shipping:.2f}\n"
        f"Total: ${order.total:.2f}\n\n"
        f"Ship to:\n{address_text}\n\n"
        f"Track your order at {settings.FRONTEND_URL}/orders"
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[recipient_email],
        fail_silently=True,
    )
