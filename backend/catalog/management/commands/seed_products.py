from django.core.management.base import BaseCommand
from catalog.models import Product


PRODUCTS = [
    {
        'title': 'T-shirt SPANISH', 'brand': 'Mango', 'price': 12, 'rating': 4.5,
        'review_count': 128,
        'image': 'https://images.unsplash.com/photo-1521572267360-7333520fc085?w=400&h=500&fit=crop&auto=format&q=80',
        'images': [
            'https://images.unsplash.com/photo-1521572267360-7333520fc085?w=400&h=500&fit=crop&auto=format&q=80',
            'https://images.unsplash.com/photo-1434389677669-e94b3604b210?w=400&h=500&fit=crop&auto=format&q=80',
        ],
        'category': 'Clothes', 'gender': 'women', 'is_new': True,
        'colors': ['#222', '#DB3022', '#fff'], 'sizes': ['XS', 'S', 'M', 'L', 'XL'],
        'stock': 42,
        'description': 'A timeless Spanish-inspired tee crafted from soft organic cotton.',
    },
    {
        'title': 'H&M Basic T-shirt', 'brand': 'H&M', 'price': 10, 'original_price': 14,
        'rating': 4.2, 'review_count': 89,
        'image': 'https://images.unsplash.com/photo-1434389677669-e94b3604b210?w=400&h=500&fit=crop&auto=format&q=80',
        'images': ['https://images.unsplash.com/photo-1434389677669-e94b3604b210?w=400&h=500&fit=crop&auto=format&q=80'],
        'category': 'Clothes', 'gender': 'women', 'is_sale': True,
        'colors': ['#222', '#fff', '#9b9b9b'], 'sizes': ['XS', 'S', 'M', 'L'],
        'stock': 28,
        'description': 'Essential basic tee with a slim fit.',
    },
    {
        'title': 'Adidas Men Galaxy', 'brand': 'Adidas', 'price': 89, 'rating': 4.8,
        'review_count': 256,
        'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&auto=format&q=80',
        'images': ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&auto=format&q=80'],
        'category': 'Shoes', 'gender': 'men', 'is_new': True,
        'colors': ['#222', '#fff', '#DB3022'], 'sizes': ['7', '8', '9', '10', '11', '12'],
        'stock': 15,
        'description': 'Galaxy-inspired running shoes with responsive cushioning.',
    },
    {
        'title': 'Nike Air Max', 'brand': 'Nike', 'price': 120, 'original_price': 150,
        'rating': 4.7, 'review_count': 312,
        'image': 'https://images.unsplash.com/photo-1460353589841-044d77ddcc0e?w=400&h=500&fit=crop&auto=format&q=80',
        'images': ['https://images.unsplash.com/photo-1460353589841-044d77ddcc0e?w=400&h=500&fit=crop&auto=format&q=80'],
        'category': 'Shoes', 'gender': 'men', 'is_sale': True,
        'colors': ['#222', '#fff'], 'sizes': ['7', '8', '9', '10', '11'],
        'stock': 8,
        'description': 'Iconic Air Max silhouette with visible Air cushioning.',
    },
    {
        'title': 'Leather Jacket', 'brand': 'Zara', 'price': 199, 'rating': 4.6,
        'review_count': 74,
        'image': 'https://images.unsplash.com/photo-1551028719-0d9b941943c5?w=400&h=500&fit=crop&auto=format&q=80',
        'images': ['https://images.unsplash.com/photo-1551028719-0d9b941943c5?w=400&h=500&fit=crop&auto=format&q=80'],
        'category': 'Clothes', 'gender': 'women', 'is_new': True,
        'colors': ['#222', '#8B4513'], 'sizes': ['XS', 'S', 'M', 'L'],
        'stock': 5,
        'description': 'Classic biker-style leather jacket.',
    },
    {
        'title': 'Summer Dress', 'brand': 'Mango', 'price': 45, 'original_price': 60,
        'rating': 4.4, 'review_count': 156,
        'image': 'https://images.unsplash.com/photo-1591047139-782c14d4b9a6?w=400&h=500&fit=crop&auto=format&q=80',
        'images': ['https://images.unsplash.com/photo-1591047139-782c14d4b9a6?w=400&h=500&fit=crop&auto=format&q=80'],
        'category': 'Clothes', 'gender': 'women', 'is_sale': True,
        'colors': ['#fff', '#DB3022', '#FFD700'], 'sizes': ['XS', 'S', 'M', 'L', 'XL'],
        'stock': 35,
        'description': 'Flowy midi dress perfect for warm days.',
    },
]


class Command(BaseCommand):
    help = 'Seed product catalog into MongoDB'

    def handle(self, *args, **options):
        Product.objects.delete()
        for data in PRODUCTS:
            Product(**data).save()
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(PRODUCTS)} products'))
