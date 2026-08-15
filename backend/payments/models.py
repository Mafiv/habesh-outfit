from mongoengine import Document, StringField


class StripeProfile(Document):
    meta = {'collection': 'stripe_profiles', 'indexes': ['user_id']}

    user_id = StringField(required=True, unique=True)
    stripe_customer_id = StringField(required=True)
    email = StringField(default='')
