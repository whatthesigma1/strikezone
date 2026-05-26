from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(APIView):
    """POST /api/auth/register/"""
    def post(self, request):
        data = request.data
        username = data.get('username', '').strip()
        email    = data.get('email', '').strip()
        password = data.get('password', '')
        password2 = data.get('password2', '')

        errors = {}
        if not username:
            errors['username'] = 'Введите имя пользователя'
        elif User.objects.filter(username=username).exists():
            errors['username'] = 'Пользователь с таким именем уже существует'

        if not email:
            errors['email'] = 'Введите email'
        elif User.objects.filter(email=email).exists():
            errors['email'] = 'Этот email уже зарегистрирован'

        if not password:
            errors['password'] = 'Введите пароль'
        elif len(password) < 6:
            errors['password'] = 'Минимум 6 символов'

        if password != password2:
            errors['password2'] = 'Пароли не совпадают'

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        tokens = get_tokens_for_user(user)
        return Response({
            'user': {'id': user.id, 'username': user.username, 'email': user.email},
            **tokens,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """POST /api/auth/login/"""
    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username or not password:
            return Response(
                {'detail': 'Введите логин и пароль'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {'detail': 'Неверный логин или пароль'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        tokens = get_tokens_for_user(user)
        return Response({
            'user': {'id': user.id, 'username': user.username, 'email': user.email},
            **tokens,
        })


class ProfileView(APIView):
    """GET /api/auth/profile/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
        })
