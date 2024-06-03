from datetime import datetime

from rest_framework import serializers
from django.utils import timezone

from .models import Photos, Commentaires, Vote, Concours


class PhotosSerializer(serializers.ModelSerializer):
    user = serializers.CharField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Photos
        fields = ['user', 'title', 'description', 'ID', 'image', 'concours']
        read_only_fields = ['user', 'ID', 'concours', 'image']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = instance.user.id
        rep['image'] = instance.image.name
        return rep


class CommentairesSerializer(serializers.ModelSerializer):
    user = serializers.CharField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Commentaires
        fields = ['user', 'texte', 'ajoutsDate', 'ID', 'photo']
        read_only_fields = ['ajoutsDate', 'user', 'ID', 'photo']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = instance.user.id
        return rep


class VoteSerializer(serializers.ModelSerializer):
    user = serializers.CharField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Vote
        fields = ['user', 'photo', 'note', 'ID']
        read_only_fields = ['user', 'ID', 'photo']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = instance.user.id
        return rep


class ConcoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concours
        fields = ['name', 'description', 'startDate', 'endDate', 'ID']
        read_only_fields = ['ID']
