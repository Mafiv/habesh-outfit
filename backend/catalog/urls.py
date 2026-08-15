from django.urls import path
from catalog.views import ProductListView, ProductDetailView, RelatedProductsView

urlpatterns = [
    path('products/', ProductListView.as_view()),
    path('products/<str:pk>/', ProductDetailView.as_view()),
    path('products/<str:pk>/related/', RelatedProductsView.as_view()),
]
