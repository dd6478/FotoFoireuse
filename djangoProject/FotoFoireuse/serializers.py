from datetime import datetime

from rest_framework import serializers
from django.utils import timezone

from .models import Photos, Commentaires, Vote, Concours


class PhotosSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Photos
        fields = ['user', 'title', 'description', 'ID']
        read_only_fields = ['user', 'ID']


class CommentairesSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.CharField(
        default=serializers.CurrentUserDefault()
    )
    ajoutsDate = serializers.DateTimeField(
        default=lambda: timezone.now()
    )
    class Meta:
        model = Commentaires
        fields = ['user', 'texte', 'ajoutsDate', 'ID', 'photo']
        read_only_fields = ['ajoutsDate', 'user', 'ID', 'photo']


class VoteSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.CharField(
        default=serializers.CurrentUserDefault()
    )
    photo = serializers.HyperlinkedRelatedField(
        view_name='concours:photos-detail',
        read_only=True
    )
    class Meta:
        model = Vote
        fields = ['user', 'photo', 'note', 'ID']
        read_only_fields = ['user', 'ID', 'photo']


class ConcoursSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Concours
        fields = ['name', 'description', 'startDate', 'endDate', 'ID']
        read_only_fields = ['ID']
