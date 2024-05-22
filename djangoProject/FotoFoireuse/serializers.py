from datetime import datetime

from rest_framework import serializers
from django.utils import timezone

from .models import Photos, Commentaires, Vote, Concours


class PhotosSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Photos
        fields = ['user', 'title', 'description', 'ID', 'image', 'concours']
        read_only_fields = ['user', 'ID', 'concours', 'image']


class CommentairesSerializer(serializers.ModelSerializer):
    user = serializers.CharField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Commentaires
        fields = ['user', 'texte', 'ajoutsDate', 'ID', 'photo']
        read_only_fields = ['ajoutsDate', 'user', 'ID', 'photo']


class VoteSerializer(serializers.ModelSerializer):
    user = serializers.CharField(
        default=serializers.CurrentUserDefault()
    )


    class Meta:
        model = Vote
        fields = ['user', 'photo', 'note', 'ID']
        read_only_fields = ['user', 'ID', 'photo']


class ConcoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concours
        fields = ['name', 'description', 'startDate', 'endDate', 'ID']
        read_only_fields = ['ID']
