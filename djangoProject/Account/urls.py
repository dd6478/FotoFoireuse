from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet
app_name = 'Account'
routers = routers.DefaultRouter()
routers.register(r'user', UserViewSet)

urlpatterns = [
    path('', include(routers.urls)),
]