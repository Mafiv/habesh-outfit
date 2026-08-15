from datetime import datetime
import random
import string

from mongoengine import (
    Document,
    EmbeddedDocument,
    StringField,
    IntField,
    FloatField,
    BooleanField,
    ListField,
    EmbeddedDocumentField,
    DateTimeField,
)


class Address(EmbeddedDocument):
    name = StringField(required=True)
    address = StringField(required=True)
    city = StringField(required=True)
    zip = StringField(required=True)


class OrderItem(EmbeddedDocument):
    product_id = StringField(required=True)
    title = StringField(required=True)
    brand = StringField(default='')
    image = StringField(default='')
    size = StringField(required=True)
    color = StringField(default='')
    quantity = IntField(default=1)
    price = FloatField(required=True)


class Order(Document):
    meta = {'collection': 'orders', 'indexes': ['user_id', '-created_at']}

    user_id = StringField(required=True)
    status = StringField(
        default='processing',
        choices=['processing', 'shipped', 'in_transit', 'delivered'],
    )
    items = ListField(EmbeddedDocumentField(OrderItem), default=list)
    subtotal = FloatField(default=0)
    discount = FloatField(default=0)
    shipping = FloatField(default=0)
    total = FloatField(default=0)
    address = EmbeddedDocumentField(Address)
    tracking_number = StringField(default='')
    stripe_session_id = StringField()
    stripe_payment_intent = StringField()
    created_at = DateTimeField(default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': f'ORD-{str(self.id)[-6:].upper()}',
            'mongoId': str(self.id),
            'date': self.created_at.strftime('%Y-%m-%d') if self.created_at else '',
            'status': self.status,
            'items': [
                {
                    'productId': i.product_id,
                    'title': i.title,
                    'brand': i.brand,
                    'image': i.image,
                    'size': i.size,
                    'color': i.color,
                    'quantity': i.quantity,
                    'price': i.price,
                }
                for i in self.items
            ],
            'subtotal': self.subtotal,
            'discount': self.discount,
            'shipping': self.shipping,
            'total': self.total,
            'address': {
                'name': self.address.name,
                'address': self.address.address,
                'city': self.address.city,
                'zip': self.address.zip,
            } if self.address else None,
            'trackingNumber': self.tracking_number,
        }


class UserAddress(Document):
    meta = {'collection': 'user_addresses', 'indexes': ['user_id']}

    user_id = StringField(required=True)
    name = StringField(required=True)
    address = StringField(required=True)
    city = StringField(required=True)
    zip = StringField(required=True)
    is_default = BooleanField(default=False)

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'address': self.address,
            'city': self.city,
            'zip': self.zip,
            'isDefault': self.is_default,
        }


class PaymentMethod(Document):
    meta = {'collection': 'payment_methods', 'indexes': ['user_id']}

    user_id = StringField(required=True)
    type = StringField(required=True, choices=['card', 'paypal'])
    label = StringField(required=True)
    last4 = StringField()
    brand = StringField()
    is_default = BooleanField(default=False)

    def to_dict(self):
        return {
            'id': str(self.id),
            'type': self.type,
            'label': self.label,
            'last4': self.last4,
            'brand': self.brand,
            'isDefault': self.is_default,
        }


class Review(Document):
    meta = {'collection': 'reviews', 'indexes': ['user_id', 'product_id']}

    user_id = StringField(required=True)
    product_id = StringField(required=True)
    product_title = StringField(required=True)
    product_image = StringField(default='')
    rating = IntField(required=True, min_value=1, max_value=5)
    comment = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'productId': self.product_id,
            'productTitle': self.product_title,
            'productImage': self.product_image,
            'rating': self.rating,
            'comment': self.comment,
            'date': self.created_at.strftime('%Y-%m-%d') if self.created_at else '',
        }


class Favorite(Document):
    meta = {'collection': 'favorites', 'indexes': [('user_id', 'product_id')]}

    user_id = StringField(required=True)
    product_id = StringField(required=True)

    def to_dict(self):
        return {'productId': self.product_id}


def generate_tracking_number():
    return 'TRK' + ''.join(random.choices(string.digits, k=9))
