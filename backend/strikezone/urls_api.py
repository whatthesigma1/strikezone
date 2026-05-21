from django.urls import path
from strikezone.apps.products.views import ProductListView, CategoryListView
from strikezone.apps.orders.views import OrderCreateView, ValidatePromoView

urlpatterns = [
    # Products
    path('products/', ProductListView.as_view(), name='products-list'),
    path('products/categories/', CategoryListView.as_view(), name='categories-list'),

    # Orders
    path('orders/', OrderCreateView.as_view(), name='orders-create'),
    path('orders/validate-promo/', ValidatePromoView.as_view(), name='validate-promo'),
]
