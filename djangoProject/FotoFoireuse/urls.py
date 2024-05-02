from django.db import router
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from djangoProject.FotoFoireuse import admin

urlpatterns = [
    path('api/', include('Account.urls')),
]