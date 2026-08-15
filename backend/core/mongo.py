import mongoengine
from django.conf import settings

def connect_mongodb():
    mongoengine.connect(
        host=settings.MONGODB_URI,
        alias='default',
    )
