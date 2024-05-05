from datetime import datetime

from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError, JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from .models import User as User
from rest_framework import permissions, viewsets
from .serializers import UserSerializer


def index(request):
    return HttpResponse("Hello, world. You're on the FotoFoireuse API")


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['register', 'login']:
            return [AllowAny()]
        return super().get_permissions()



    @action(detail=False, methods=['post'])
    def register(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password or not email:
            return Response({'error': 'Username, password and email are required'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)

        user = User(username=username, email=email, password=make_password(password))
        user.save()

        return Response({'message': 'User created successfully'}, status=201)

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=400)

        if not check_password(password, user.password):
            return Response({'error': 'Incorrect password'}, status=400)

        refresh = RefreshToken.for_user(user)
        access = AccessToken.for_user(user)
        user.last_login = datetime.now()
        user.save()
        return Response({
            'refresh': str(refresh),
            'access': str(access),
        }, status=200)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            refresh = request.data.get('refresh')
            token = RefreshToken(refresh)
            token.blacklist()
        except TokenError:
            return Response({'error': 'Invalid token'}, status=400)

        return Response({'message': 'Logout successful'}, status=200)

    @action(detail=False, methods=['get'])
    def test(self, request):
        user = request.user
        if user.is_authenticated:
            return Response({'message': f'Bonjour, {user.username}!'}, status=200)
        else:
            return Response({'error': 'Utilisateur non trouvé'}, status=404)
