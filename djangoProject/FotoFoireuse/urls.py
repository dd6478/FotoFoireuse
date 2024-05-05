from django.urls import path, include
from rest_framework_nested import routers

from .views import ConcoursViewSet, PhotosViewSet

app_name = 'concours'
router = routers.SimpleRouter()
router.register(r'concours', ConcoursViewSet)

concours_router = routers.NestedSimpleRouter(router, r'concours', lookup='concours')
concours_router.register(r'photos', PhotosViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('', include(concours_router.urls)),
]