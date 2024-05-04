from django.contrib.auth.models import AbstractUser
from django.db import models


class UserProfile(AbstractUser):
    password = models.CharField(max_length=100)
    value = models.IntegerField(default=0)