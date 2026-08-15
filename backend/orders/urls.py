from django.urls import path
from orders.views import (
    OrderListCreateView,
    OrderDetailView,
    AddressListCreateView,
    AddressDetailView,
    PaymentMethodListCreateView,
    PaymentMethodDetailView,
    ReviewListCreateView,
    ReviewDetailView,
    FavoriteListView,
)

urlpatterns = [
    path('orders/', OrderListCreateView.as_view()),
    path('orders/<str:pk>/', OrderDetailView.as_view()),
    path('addresses/', AddressListCreateView.as_view()),
    path('addresses/<str:pk>/', AddressDetailView.as_view()),
    path('payment-methods/', PaymentMethodListCreateView.as_view()),
    path('payment-methods/<str:pk>/', PaymentMethodDetailView.as_view()),
    path('reviews/', ReviewListCreateView.as_view()),
    path('reviews/<str:pk>/', ReviewDetailView.as_view()),
    path('favorites/', FavoriteListView.as_view()),
]
