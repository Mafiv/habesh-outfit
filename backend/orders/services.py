"""Shared order, cart, promo, and inventory logic."""

from bson import ObjectId
from bson.errors import InvalidId

from catalog.models import Product
from orders.models import (
    Order,
    OrderItem,
    Address,
    UserAddress,
    Cart,
    CartItem,
    generate_tracking_number,
)

PROMO_CODES = {
    'SAVE10': 0.10,
    'STYLE20': 0.20,
    'WELCOME15': 0.15,
}

FREE_SHIPPING_THRESHOLD = 50.0
SHIPPING_COST = 9.99


def get_promo_rate(code: str) -> float:
    return PROMO_CODES.get((code or '').upper(), 0.0)


def calculate_totals(items: list[dict], promocode: str = '') -> dict:
    subtotal = sum(i['price'] * i.get('quantity', 1) for i in items)
    discount_rate = get_promo_rate(promocode)
    discount = round(subtotal * discount_rate, 2)
    shipping = 0.0 if subtotal > FREE_SHIPPING_THRESHOLD else SHIPPING_COST
    total = round(subtotal - discount + shipping, 2)
    return {
        'subtotal': round(subtotal, 2),
        'discount': discount,
        'shipping': shipping,
        'total': total,
        'discountRate': discount_rate,
    }


def validate_promocode(code: str) -> dict:
    rate = get_promo_rate(code)
    if not rate:
        return {'valid': False, 'code': (code or '').upper(), 'discount': 0}
    return {
        'valid': True,
        'code': code.upper(),
        'discount': rate,
        'description': f'{int(rate * 100)}% off your order',
    }


def validate_stock(items: list[dict]) -> list[str]:
    """Return human-readable errors when requested quantity exceeds stock."""
    errors = []
    requested: dict[str, int] = {}

    for item in items:
        product_id = item.get('productId') or item.get('product_id')
        qty = item.get('quantity', 1)
        if not product_id:
            continue
        requested[product_id] = requested.get(product_id, 0) + qty

    for product_id, qty in requested.items():
        try:
            product = Product.objects.get(id=ObjectId(product_id))
        except (Product.DoesNotExist, InvalidId):
            errors.append(f'Product {product_id} is no longer available.')
            continue
        if product.stock <= 0:
            errors.append(f'{product.title} is out of stock.')
        elif qty > product.stock:
            errors.append(
                f'{product.title}: only {product.stock} left in stock.'
            )

    return errors


def decrement_stock(items) -> None:
    """Reduce product stock after a successful order."""
    totals: dict[str, int] = {}
    for item in items:
        pid = getattr(item, 'product_id', None) or item.get('productId')
        qty = getattr(item, 'quantity', None) or item.get('quantity', 1)
        if pid:
            totals[str(pid)] = totals.get(str(pid), 0) + qty

    for product_id, qty in totals.items():
        try:
            product = Product.objects.get(id=ObjectId(product_id))
            product.stock = max(0, product.stock - qty)
            product.save()
        except (Product.DoesNotExist, InvalidId):
            pass


def resolve_address(user_id: str, address_id: str | None) -> Address | None:
    if not address_id:
        default = UserAddress.objects.filter(user_id=user_id, is_default=True).first()
        if not default:
            default = UserAddress.objects.filter(user_id=user_id).first()
        if default:
            return Address(
                name=default.name,
                address=default.address,
                city=default.city,
                zip=default.zip,
            )
        return None

    try:
        addr = UserAddress.objects.get(id=ObjectId(address_id), user_id=user_id)
    except (UserAddress.DoesNotExist, InvalidId):
        return None

    return Address(
        name=addr.name,
        address=addr.address,
        city=addr.city,
        zip=addr.zip,
    )


def items_to_order_items(items: list[dict]) -> list[OrderItem]:
    return [
        OrderItem(
            product_id=item['productId'],
            title=item['title'],
            brand=item.get('brand', ''),
            image=item.get('image', ''),
            size=item['size'],
            color=item.get('color', ''),
            quantity=item.get('quantity', 1),
            price=item['price'],
        )
        for item in items
    ]


def create_pending_order(
    user_id: str,
    items: list[dict],
    promocode: str = '',
    address_id: str | None = None,
) -> Order:
    stock_errors = validate_stock(items)
    if stock_errors:
        raise ValueError(stock_errors[0])

    totals = calculate_totals(items, promocode)
    order = Order(
        user_id=user_id,
        status='pending_payment',
        items=items_to_order_items(items),
        subtotal=totals['subtotal'],
        discount=totals['discount'],
        shipping=totals['shipping'],
        total=totals['total'],
        address=resolve_address(user_id, address_id),
        tracking_number=generate_tracking_number(),
    )
    order.save()
    return order


def complete_order_payment(order: Order, session: dict, customer_email: str = '') -> Order:
    order.stripe_session_id = session.get('id', '')
    order.stripe_payment_intent = session.get('payment_intent', '') or ''
    order.status = 'processing'
    order.save()
    decrement_stock(order.items)
    clear_user_cart(order.user_id)

    if customer_email:
        from core.email import send_order_confirmation
        send_order_confirmation(order, customer_email)

    return order


def cancel_pending_order(order: Order) -> Order:
    if order.status == 'pending_payment':
        order.status = 'cancelled'
        order.save()
    return order


def get_or_create_cart(user_id: str) -> Cart:
    cart = Cart.objects.filter(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        cart.save()
    return cart


def clear_user_cart(user_id: str) -> None:
    Cart.objects.filter(user_id=user_id).delete()


def cart_items_from_request(items_data: list[dict]) -> list[CartItem]:
    result = []
    for item in items_data:
        product_id = item.get('productId') or item.get('product_id')
        if not product_id:
            continue
        try:
            product = Product.objects.get(id=ObjectId(product_id))
        except (Product.DoesNotExist, InvalidId):
            product = None

        result.append(
            CartItem(
                product_id=str(product_id),
                title=item.get('title') or (product.title if product else 'Unknown'),
                brand=item.get('brand') or (product.brand if product else ''),
                image=item.get('image') or (product.image if product else ''),
                size=item['size'],
                color=item.get('color', ''),
                quantity=item.get('quantity', 1),
                price=item.get('price') or (product.price if product else 0),
            )
        )
    return result


def merge_cart_items(existing: list[CartItem], incoming: list[CartItem]) -> list[CartItem]:
    merged = {f'{i.product_id}:{i.size}:{i.color}': i for i in existing}
    for item in incoming:
        key = f'{item.product_id}:{item.size}:{item.color}'
        if key in merged:
            merged[key].quantity += item.quantity
        else:
            merged[key] = item
    return list(merged.values())
