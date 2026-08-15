from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from bson import ObjectId
from bson.errors import InvalidId

from catalog.models import Product


class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        gender = request.query_params.get('gender')
        subcategory = request.query_params.get('subcategory')
        qs = Product.objects.all()

        if gender:
            qs = qs.filter(gender=gender)
        if subcategory:
            if subcategory.lower() == 'new':
                qs = qs.filter(is_new=True)
            else:
                qs = qs.filter(category__iexact=subcategory)

        sort = request.query_params.get('sort', 'low')
        products = list(qs)
        products.sort(key=lambda p: p.price, reverse=(sort == 'high'))

        return Response([p.to_dict() for p in products])


class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            product = Product.objects.get(id=ObjectId(pk))
        except (Product.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)
        return Response(product.to_dict())


class RelatedProductsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            product = Product.objects.get(id=ObjectId(pk))
        except (Product.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)

        related = Product.objects.filter(
            category=product.category, id__ne=product.id
        ).limit(4)
        return Response([p.to_dict() for p in related])
