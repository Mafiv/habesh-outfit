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
from catalog.models import Product


def get_user_id(request):
    return str(request.user.id)


class OrderListCreateView(APIView):
    def get(self, request):
        orders = Order.objects.filter(user_id=get_user_id(request)).order_by('-created_at')
        return Response([o.to_dict() for o in orders])

    def post(self, request):
        data = request.data
        items_data = data.get('items', [])
        address_data = data.get('address')

        order_items = []
        for item in items_data:
            order_items.append(
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
            )

        address = None
        if address_data:
            address = Address(
                name=address_data['name'],
                address=address_data['address'],
                city=address_data['city'],
                zip=address_data['zip'],
            )

        order = Order(
            user_id=get_user_id(request),
            items=order_items,
            subtotal=data.get('subtotal', 0),
            discount=data.get('discount', 0),
            shipping=data.get('shipping', 0),
            total=data.get('total', 0),
            address=address,
            tracking_number=generate_tracking_number(),
            stripe_session_id=data.get('stripeSessionId'),
        )
        order.save()
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
