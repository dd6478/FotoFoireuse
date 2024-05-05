from django.db import IntegrityError
from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Photos, Commentaires, Vote, Concours
from .serializers import PhotosSerializer, CommentairesSerializer, VoteSerializer, ConcoursSerializer

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Concours, Photos, Commentaires, Vote
from .serializers import ConcoursSerializer, PhotosSerializer, CommentairesSerializer, VoteSerializer

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Concours, Photos, Commentaires, Vote
from .serializers import ConcoursSerializer, PhotosSerializer, CommentairesSerializer, VoteSerializer


class ConcoursViewSet(viewsets.ModelViewSet):
    queryset = Concours.objects.all()
    serializer_class = ConcoursSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get', 'post'])
    def photos(self, request, pk=None):
        if request.method == 'POST':
            if not request.data.get('title'):
                return Response({'error': 'Missing title'}, status=400)
            concours = self.get_object()
            user = request.user
            photo = Photos.objects.create(user=user, concours=concours, **request.data)
            serializer = PhotosSerializer(photo)
            return Response(serializer.data)
        if request.method == 'GET':
            concours = self.get_object()
            photos = Photos.objects.filter(concours=concours)
            serializer = PhotosSerializer(photos, many=True)
            return Response(serializer.data)


class PhotosViewSet(viewsets.ModelViewSet):
    queryset = Photos.objects.all()
    serializer_class = PhotosSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get', 'post'])
    def commentaires(self, request, pk=None, concours_pk=None):
        if request.method == 'POST':
            if not request.data.get('texte'):
                return Response({'error': 'Missing texte'}, status=400)
            photo = self.get_object()
            user = request.user
            commentaire = Commentaires.objects.create(user=user, photo=photo, **request.data)
            serializer = CommentairesSerializer(commentaire, context={'request': request})
            return Response(serializer.data)
        elif request.method == 'GET':
            photo = self.get_object()
            commentaires = Commentaires.objects.filter(photo=photo)
            serializer = CommentairesSerializer(commentaires, many=True)
            return Response(serializer.data)

    @action(detail=True, methods=['get', 'post'])
    def votes(self, request, pk=None, concours_pk=None):
        if request.method == 'POST':
            if not request.data.get('note'):
                return Response({'error': 'Missing note'}, status=400)
            photo = self.get_object()
            user = request.user
            try :
                vote = Vote.objects.create(user=user, photo=photo, **request.data)
            except IntegrityError:
                return Response({'error': 'Already voted for this photo'}, status=400)
            serializer = VoteSerializer(vote, context={'request': request})
            return Response(serializer.data)
        elif request.method == 'GET':
            photo = self.get_object()
            votes = Vote.objects.filter(photo=photo)
            serializer = VoteSerializer(votes, many=True)
            return Response(serializer.data)
