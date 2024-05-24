from django.urls import path, include
from rest_framework import routers
from .views import ConcoursViewSet, PhotosViewSet, CommentairesViewSet, VotesViewSet

app_name = 'FotoFoireuse'
router = routers.SimpleRouter()
router.register(r'concours', ConcoursViewSet)
router.register(r'photos', PhotosViewSet)
router.register(r'commentaires', CommentairesViewSet)
router.register(r'votes', VotesViewSet)
urlpatterns = [
    path('', include(router.urls))
]