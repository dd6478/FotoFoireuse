from django.db import models

# Create your models here.
class WebUser(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40)
    surname = models.CharField(max_length=40)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

class Photo(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40)
    path = models.CharField(max_length=100)
    rank = models.FloatField()
    web_user = models.ForeignKey(WebUser, on_delete=models.CASCADE)
