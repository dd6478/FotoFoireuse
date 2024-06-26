from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    Choices = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('NB', 'Non Binary')
    )
    password = models.CharField(max_length=100)
    value = models.IntegerField(default=0)
    sexe = models.CharField(max_length=2, choices=Choices)
