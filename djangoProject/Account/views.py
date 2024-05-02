import json

from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from .models import User


def index(request):
    return HttpResponse('Hello, World! Welcome to fotofoireuse API !')


@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = make_password(data.get('password'))
        email = data.get('email')
        user = User.objects.create(username=username, password=password, email=email)
        user.save()
        return HttpResponse('User created', status=200)
    else:
        return HttpResponseBadRequest('Bad request')


@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return HttpResponseBadRequest('User does not exist')

        if user is not None:
            if check_password(password, user.password):
                # create JWT token
                refresh = RefreshToken.for_user(user)
                access = AccessToken.for_user(user)
                return JsonResponse({
                    'refresh': str(refresh),
                    'access': str(access),
                })
            else:
                return HttpResponseBadRequest('Incorrect password')
        else:
            return HttpResponseServerError('An error occurred')


@csrf_exempt
def logout(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        refresh_token = data.get('refresh')
        if refresh_token is None:
            return HttpResponseBadRequest('Bad request')

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except InvalidToken:
            return HttpResponseBadRequest('Invalid token')

        return HttpResponse('Logout successful', status=200)
    else:
        return HttpResponseBadRequest('Bad request')


def testLogin(request):
    if request.user.is_authenticated:
        return HttpResponse({"message": "Token d'accès valide"}, status=200)
    else:
        return HttpResponse({"message": "Token d'accès invalide"}, status=401)
