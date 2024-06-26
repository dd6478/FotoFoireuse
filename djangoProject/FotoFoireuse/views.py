import mimetypes
import os

from django.db import IntegrityError
from django.http import FileResponse, Http404
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.generics import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Concours, Photos, Commentaires, Vote, Publications
from .serializers import ConcoursSerializer, PublicationsSerializer, PhotosSerializer, CommentairesSerializer, \
    VoteSerializer
from django.conf import settings

from Account.models import User


class SecuModelViewSet(viewsets.ModelViewSet):
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user == request.user or request.user.is_superuser:
            return super().update(request, *args, **kwargs)
        return Response({"Error": "You're not allowed to do that"}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user == request.user or request.user.is_superuser:
            return super().destroy(request, *args, **kwargs)
        return Response({"Error": "You're not allowed to do that"}, status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user == request.user or request.user.is_superuser:
            return super().partial_update(request, *args, **kwargs)
        return Response({"Error": "You're not allowed to do that"}, status=status.HTTP_403_FORBIDDEN)


class ConcoursViewSet(SecuModelViewSet):
    queryset = Concours.objects.all()
    serializer_class = ConcoursSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get', 'post'])
    def publications(self, request, pk=None):
        concours = self.get_object()

        if request.method == 'POST':
            if not request.data.get('title'):
                return Response({'error': 'Missing "title" field'}, status=status.HTTP_400_BAD_REQUEST)
            publications = Publications.objects.create(concours=concours,
                                                     title=request.data.get('title'),
                                                     user=request.user,
                                                     description=request.data.get('description') or 'Empty')
            serializer = PublicationsSerializer(publications, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        elif request.method == 'GET':
            publications = Publications.objects.filter(concours=concours)
            serializer = PublicationsSerializer(publications, many=True, context={'request': request})
            return Response(serializer.data)


class PublicationViewSet(SecuModelViewSet):
    queryset = Publications.objects.all()
    serializer_class = PublicationsSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(auto_schema=None)
    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed('POST')

    @action(detail=True, methods=['get', 'post'], parser_classes=[MultiPartParser, FormParser])
    def photos(self, request, pk=None):
        if request.method == 'POST':
            if not request.data.get('image'):
                return Response({'error': 'Missing image'}, status=400)
            image = request.FILES['image'][0] if isinstance(request.FILES['image'], list) else request.FILES['image']
            if image.content_type not in ['image/jpeg', 'image/png']:
                return Response({'error': 'Invalid image format'}, status=status.HTTP_400_BAD_REQUEST)
            publications = self.get_object()
            user = request.user
            if 'ajoutsDate' in request.data and request.data['ajoutsDate'] is None:
                del request.data['ajoutsDate']
            photo = Photos.objects.create(user=user, publications=publications, image=image)
            if not publications.first_photo:
                publications.first_photo = photo
                publications.save()
            serializer = PhotosSerializer(photo, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        elif request.method == 'GET':
            publications = self.get_object()
            photos = Photos.objects.filter(publications=publications)
            serializer = PhotosSerializer(photos, many=True, context={'request': request})
            return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        publications = get_object_or_404(Publications, pk=pk)
        media_path = os.path.join(settings.MEDIA_ROOT, publications.first_photo.image.name)

        if os.path.exists(media_path):
            mime_type, _ = mimetypes.guess_type(media_path)
            if mime_type is None:
                mime_type = 'application/octet-stream'
            return FileResponse(open(media_path, 'rb'), content_type=mime_type)
        else:
            raise Http404("Image not found")

    @action(detail=True, methods=['get', 'post'])
    def commentaires(self, request, pk=None):
        if request.method == 'POST':
            if not request.data.get('texte'):
                return Response({'error': 'Missing texte'}, status=400)
            publications = self.get_object()
            user = request.user
            if 'ajoutsDate' in request.data and request.data['ajoutsDate'] is None:
                del request.data['ajoutsDate']
            commentaire = Commentaires.objects.create(user=user, publications=publications, **request.data)
            serializer = CommentairesSerializer(commentaire, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        elif request.method == 'GET':
            publications = self.get_object()
            commentaires = Commentaires.objects.filter(publications=publications)
            serializer = CommentairesSerializer(commentaires, many=True, context={'request': request})
            return Response(serializer.data)

    @action(detail=True, methods=['get', 'post'])
    def votes(self, request, pk=None):
        if request.method == 'POST':
            if not request.data.get('note'):
                return Response({'error': 'Missing note'}, status=400)
            publications = self.get_object()
            user = request.user
            try:
                vote = Vote.objects.create(user=user, publications=publications, note=request.data['note'])
            except IntegrityError:
                return Response({'error': 'Already voted for this photo'}, status=400)
            serializer = VoteSerializer(vote, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        elif request.method == 'GET':
            publications = self.get_object()
            votes = Vote.objects.filter(publications=publications)
            serializer = VoteSerializer(votes, many=True, context={'request': request})
            return Response(serializer.data)


class PhotosViewSet(SecuModelViewSet):
    queryset = Photos.objects.all()
    serializer_class = PhotosSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(auto_schema=None)
    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed('POST')

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[0-9]+)')
    def user_photos(self, request, user_id=None):
        user = get_object_or_404(User, pk=user_id)
        photos = Photos.objects.filter(user=user)
        serializer = PhotosSerializer(photos, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        photo = get_object_or_404(Photos, pk=pk)
        media_path = os.path.join(settings.MEDIA_ROOT, photo.image.name)

        if os.path.exists(media_path):
            mime_type, _ = mimetypes.guess_type(media_path)
            if mime_type is None:
                mime_type = 'application/octet-stream'
            return FileResponse(open(media_path, 'rb'), content_type=mime_type)
        else:
            raise Http404("Image not found")



class VotesViewSet(SecuModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(auto_schema=None)
    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed('POST')


class CommentairesViewSet(SecuModelViewSet):
    queryset = Commentaires.objects.all()
    serializer_class = CommentairesSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(auto_schema=None)
    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed('POST')
