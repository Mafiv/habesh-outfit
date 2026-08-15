from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from bson import ObjectId
from bson.errors import InvalidId
from mongoengine.queryset.visitor import Q

from catalog.models import Product
from orders.models import Review


DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        gender = request.query_params.get('gender')
        subcategory = request.query_params.get('subcategory')
        search = request.query_params.get('q', '').strip()
        sort = request.query_params.get('sort', 'low')
        in_stock = request.query_params.get('inStock')

        try:
            page = max(1, int(request.query_params.get('page', 1)))
        except ValueError:
            page = 1
        try:
            page_size = min(
                MAX_PAGE_SIZE,
                max(1, int(request.query_params.get('pageSize', DEFAULT_PAGE_SIZE))),
            )
        except ValueError:
            page_size = DEFAULT_PAGE_SIZE

        qs = Product.objects.all()

        if gender:
            qs = qs.filter(gender=gender)
        if subcategory:
            if subcategory.lower() == 'new':
                qs = qs.filter(is_new=True)
            else:
                qs = qs.filter(category__iexact=subcategory)
        if in_stock == 'true':
            qs = qs.filter(stock__gt=0)
        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(brand__icontains=search)
                | Q(category__icontains=search)
                | Q(description__icontains=search)
            )

        products = list(qs)
        products.sort(key=lambda p: p.price, reverse=(sort == 'high'))

        total = len(products)
        start = (page - 1) * page_size
        end = start + page_size
        page_items = products[start:end]

        return Response({
            'results': [p.to_dict() for p in page_items],
            'count': total,
            'page': page,
            'pageSize': page_size,
            'totalPages': max(1, (total + page_size - 1) // page_size),
        })


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
            category=product.category, id__ne=product.id, stock__gt=0
        ).limit(4)
        return Response([p.to_dict() for p in related])


class ProductReviewsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            product = Product.objects.get(id=ObjectId(pk))
        except (Product.DoesNotExist, InvalidId):
            return Response({'detail': 'Not found.'}, status=404)

        reviews = Review.objects.filter(product_id=str(product.id)).order_by('-created_at')
        return Response({
            'productId': str(product.id),
            'averageRating': product.rating,
            'reviewCount': product.review_count,
            'reviews': [
                {
                    'id': str(r.id),
                    'rating': r.rating,
                    'comment': r.comment,
                    'date': r.created_at.strftime('%Y-%m-%d') if r.created_at else '',
                    'productTitle': r.product_title,
                }
                for r in reviews
            ],
        })
