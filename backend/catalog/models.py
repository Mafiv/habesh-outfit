from mongoengine import (
    Document,
    StringField,
    IntField,
    FloatField,
    BooleanField,
    ListField,
)


class Product(Document):
    meta = {'collection': 'products', 'indexes': ['gender', 'category', 'is_new', 'is_sale']}

    title = StringField(required=True, max_length=200)
    brand = StringField(required=True, max_length=100)
    price = FloatField(required=True)
    original_price = FloatField()
    rating = FloatField(default=0)
    review_count = IntField(default=0)
    image = StringField(required=True)
    images = ListField(StringField(), default=list)
    category = StringField(required=True)
    subcategory = StringField(default='')
    gender = StringField(required=True, choices=['women', 'men', 'kids'])
    is_new = BooleanField(default=False)
    is_sale = BooleanField(default=False)
    colors = ListField(StringField(), default=list)
    sizes = ListField(StringField(), default=list)
    description = StringField(default='')

    def to_dict(self):
        return {
            'id': str(self.id),
            'title': self.title,
            'brand': self.brand,
            'price': self.price,
            'originalPrice': self.original_price,
            'rating': self.rating,
            'reviewCount': self.review_count,
            'image': self.image,
            'images': self.images,
            'category': self.category,
            'subcategory': self.subcategory,
            'gender': self.gender,
            'isNew': self.is_new,
            'isSale': self.is_sale,
            'colors': self.colors,
            'sizes': self.sizes,
            'description': self.description,
        }
