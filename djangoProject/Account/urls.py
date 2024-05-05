from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, index
from rest_framework_simplejwt import views as jwt_views

app_name = 'Account'
routers = routers.DefaultRouter()
routers.register(r'user', UserViewSet)
urlpatterns = [
    path('', index),
    path('', include(routers.urls)),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
