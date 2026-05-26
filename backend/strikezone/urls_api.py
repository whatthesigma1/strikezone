from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from strikezone.apps.products.views import ProductListView, CategoryListView
from strikezone.apps.orders.views import OrderCreateView, ValidatePromoView
from strikezone.apps.auth_app.views import RegisterView, LoginView, ProfileView

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/',    LoginView.as_view(),    name='auth-login'),
    path('auth/profile/',  ProfileView.as_view(),  name='auth-profile'),
    path('auth/refresh/',  TokenRefreshView.as_view(), name='auth-refresh'),

    # Products
    path('products/', ProductListView.as_view(), name='products-list'),
    path('products/categories/', CategoryListView.as_view(), name='categories-list'),

    # Orders
    path('orders/', OrderCreateView.as_view(), name='orders-create'),
    path('orders/validate-promo/', ValidatePromoView.as_view(), name='validate-promo'),
]
