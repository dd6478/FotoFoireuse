from django.urls import path
from . import views


app_name = 'polls'
urlpatterns = [
    path('', views.list_view, name='index'),
    path('<int:pk>/', views.detail_view, name='detail'),
    path('<int:pk>/results/', views.ResultsView.as_view(), name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
    path('create/', views.create_view, name='create'),
    path('update/<int:pk>/', views.update_view, name='update'),
    path('delete/<int:pk>/', views.delete_view, name='delete'),
    path('choice/create/', views.create_choice_view, name='createChoice'),
    path('home/', views.home, name='home')
]
