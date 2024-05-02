from django.urls import path
from . import views
app_name = 'Account'
urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'),
    path('test/', views.testLogin, name='test')
]