from datetime import datetime

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from bson import ObjectId
from bson.errors import InvalidId

from orders.models import (
    Order,
    OrderItem,
    UserAddress,
    PaymentMethod,
    Review,
    Favorite,
    Address,
    generate_tracking_number,
)
from orders.services import (
    calculate_totals,
    get_or_create_cart,
    clear_user_cart,
    cart_items_from_request,
    merge_cart_items,
    resolve_address,
    items_to_order_items,
    validate_stock,
    decrement_stock,
)
from catalog.models import Product


def get_user_id(request):
    return str(request.user.id)


def _cart_items_payload(cart) -> list[dict]:
    return [
        {
            'productId': i.product_id,
            'title': i.title,
            'quantity': i.quantity,
            'price': i.price,
            'size': i.size,
            'color': i.color,
        }
        for i in cart.items
    ]


def _validate_cart_stock(cart) -> Response | None:
    errors = validate_stock(_cart_items_payload(cart))
    if errors:
        return Response({'detail': errors[0], 'errors': errors}, status=400)
    return None


class CartView(APIView):
    def get(self, request):
        cart = get_or_create_cart(get_user_id(request))
        totals = calculate_totals(
            [
                {
                    'price': i.price,
                    'quantity': i.quantity,
                }
                for i in cart.items
            ],
            cart.promocode,
        )
        return Response({**cart.to_dict(), **totals})

    def put(self, request):
        user_id = get_user_id(request)
        cart = get_or_create_cart(user_id)
        data = request.data

        if 'items' in data:
            cart.items = cart_items_from_request(data['items'])

        stock_error = _validate_cart_stock(cart)
        if stock_error:
            return stock_error

        if 'promocode' in data:
            cart.promocode = data.get('promocode', '')

        cart.updated_at = datetime.utcnow()
        cart.save()

        totals = calculate_totals(
            [{'price': i.price, 'quantity': i.quantity} for i in cart.items],
            cart.promocode,
        )
        return Response({**cart.to_dict(), **totals})

    def post(self, request):
        """Merge guest cart items into the user's server cart."""
        user_id = get_user_id(request)
        cart = get_or_create_cart(user_id)
        incoming = cart_items_from_request(request.data.get('items', []))
        cart.items = merge_cart_items(list(cart.items), incoming)

        stock_error = _validate_cart_stock(cart)
        if stock_error:
            return stock_error

        if request.data.get('promocode'):
            cart.promocode = request.data['promocode']
        cart.updated_at = datetime.utcnow()
        cart.save()

        totals = calculate_totals(
            [{'price': i.price, 'quantity': i.quantity} for i in cart.items],
            cart.promocode,
        )
        return Response({**cart.to_dict(), **totals})

    def delete(self, request):
        clear_user_cart(get_user_id(request))
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderListCreateView(APIView):
    def get(self, request):
        orders = Order.objects.filter(user_id=get_user_id(request)).order_by('-created_at')
        return Response([o.to_dict() for o in orders])

    def post(self, request):
        data = request.data
        user_id = get_user_id(request)
        items_data = data.get('items', [])
        promocode = data.get('promocode', '')

        stock_errors = validate_stock(items_data)
        if stock_errors:
            return Response({'detail': stock_errors[0], 'errors': stock_errors}, status=400)

        totals = calculate_totals(
            [
                {
                    'price': item.get('price', 0),
                    'quantity': item.get('quantity', 1),
                }
                for item in items_data
            ],
            promocode,
        )

        address = None
        if data.get('address'):
            addr = data['address']
            address = Address(
                name=addr['name'],
                address=addr['address'],
                city=addr['city'],
                zip=addr['zip'],
            )
        elif data.get('addressId'):
            address = resolve_address(user_id, data['addressId'])

        order = Order(
            user_id=user_id,
            items=items_to_order_items(items_data),
            subtotal=data.get('subtotal', totals['subtotal']),
            discount=data.get('discount', totals['discount']),
            shipping=data.get('shipping', totals['shipping']),
            total=data.get('total', totals['total']),
            address=address,
            tracking_number=generate_tracking_number(),
            stripe_session_id=data.get('stripeSessionId'),
        )
        order.save()
        decrement_stock(order.items)
        clear_user_cart(user_id)

        customer_email = getattr(request.user, 'email', '')
        if customer_email:
            from core.email import send_order_confirmation
            send_order_confirmation(order, customer_email)

        return Response(order.to_dict(), status=status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    def get(self, request, pk):
        try:
            order = Order.objects.get(id=ObjectId(pk), user_id=get_user_id(request))
        except (Order.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)
        return Response(order.to_dict())


class AddressListCreateView(APIView):
    def get(self, request):
        addrs = UserAddress.objects.filter(user_id=get_user_id(request))
        return Response([a.to_dict() for a in addrs])

    def post(self, request):
        data = request.data
        user_id = get_user_id(request)
        is_default = data.get('isDefault', False)

        if is_default:
            UserAddress.objects.filter(user_id=user_id).update(is_default=False)

        addr = UserAddress(
            user_id=user_id,
            name=data['name'],
            address=data['address'],
            city=data['city'],
            zip=data['zip'],
            is_default=is_default or not UserAddress.objects.filter(user_id=user_id).count(),
        )
        addr.save()
        return Response(addr.to_dict(), status=status.HTTP_201_CREATED)


class AddressDetailView(APIView):
    def delete(self, request, pk):
        try:
            addr = UserAddress.objects.get(id=ObjectId(pk), user_id=get_user_id(request))
        except (UserAddress.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)
        addr.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk):
        try:
            addr = UserAddress.objects.get(id=ObjectId(pk), user_id=get_user_id(request))
        except (UserAddress.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)

        if request.data.get('isDefault'):
            UserAddress.objects.filter(user_id=get_user_id(request)).update(is_default=False)
            addr.is_default = True
            addr.save()

        return Response(addr.to_dict())


class PaymentMethodListCreateView(APIView):
    def get(self, request):
        methods = PaymentMethod.objects.filter(user_id=get_user_id(request))
        return Response([m.to_dict() for m in methods])

    def post(self, request):
        data = request.data
        user_id = get_user_id(request)
        is_default = data.get('isDefault', False)

        if is_default:
            PaymentMethod.objects.filter(user_id=user_id).update(is_default=False)

        method = PaymentMethod(
            user_id=user_id,
            type=data['type'],
            label=data['label'],
            last4=data.get('last4'),
            brand=data.get('brand'),
            is_default=is_default or not PaymentMethod.objects.filter(user_id=user_id).count(),
        )
        method.save()
        return Response(method.to_dict(), status=status.HTTP_201_CREATED)


class PaymentMethodDetailView(APIView):
    def delete(self, request, pk):
        try:
            method = PaymentMethod.objects.get(id=ObjectId(pk), user_id=get_user_id(request))
        except (PaymentMethod.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)

        if method.stripe_payment_method_id:
            from payments.stripe_service import detach_stripe_payment_method
            detach_stripe_payment_method(get_user_id(request), method)
        else:
            method.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk):
        try:
            method = PaymentMethod.objects.get(id=ObjectId(pk), user_id=get_user_id(request))
        except (PaymentMethod.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)

        if request.data.get('isDefault'):
            PaymentMethod.objects.filter(user_id=get_user_id(request)).update(is_default=False)
            method.is_default = True
            method.save()

        return Response(method.to_dict())


class ReviewListCreateView(APIView):
    def get(self, request):
        reviews = Review.objects.filter(user_id=get_user_id(request)).order_by('-created_at')
        return Response([r.to_dict() for r in reviews])

    def post(self, request):
        data = request.data
        review = Review(
            user_id=get_user_id(request),
            product_id=data['productId'],
            product_title=data['productTitle'],
            product_image=data.get('productImage', ''),
            rating=data['rating'],
            comment=data['comment'],
        )
        review.save()

        try:
            product = Product.objects.get(id=ObjectId(data['productId']))
            product_reviews = Review.objects.filter(product_id=str(product.id))
            ratings = [r.rating for r in product_reviews]
            product.review_count = len(ratings)
            product.rating = round(sum(ratings) / len(ratings), 1) if ratings else data['rating']
            product.save()
        except (Product.DoesNotExist, InvalidId):
            pass

        return Response(review.to_dict(), status=status.HTTP_201_CREATED)


class ReviewDetailView(APIView):
    def delete(self, request, pk):
        try:
            review = Review.objects.get(id=ObjectId(pk), user_id=get_user_id(request))
        except (Review.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FavoriteListView(APIView):
    def get(self, request):
        favs = Favorite.objects.filter(user_id=get_user_id(request))
        product_ids_list = [f.product_id for f in favs]
        product_ids = []
        for pid in product_ids_list:
            try:
                product_ids.append(ObjectId(pid))
            except InvalidId:
                pass
        products = Product.objects.filter(id__in=product_ids) if product_ids else []
        return Response([p.to_dict() for p in products])

    def post(self, request):
        product_id = request.data.get('productId')
        user_id = get_user_id(request)
        existing = Favorite.objects.filter(user_id=user_id, product_id=product_id).first()
        if existing:
            existing.delete()
            return Response({'favorited': False})
        Favorite(user_id=user_id, product_id=product_id).save()
        return Response({'favorited': True})
