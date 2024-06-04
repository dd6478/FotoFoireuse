from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Photos(models.Model):
    ID = models.AutoField(primary_key=True)
    user = models.ForeignKey('Account.User', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='photos/')
    publications = models.ForeignKey('Publications', on_delete=models.CASCADE)

class Publications(models.Model):
    ID = models.AutoField(primary_key=True)
    user = models.ForeignKey('Account.User', on_delete=models.CASCADE)
    concours = models.ForeignKey('Concours', on_delete=models.CASCADE, related_name='publications')
    first_photo = models.OneToOneField(Photos, on_delete=models.SET_NULL, null=True, related_name='+')
    title = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return self.title

class Commentaires(models.Model):
    ID = models.AutoField(primary_key=True)
    user = models.ForeignKey('Account.User', on_delete=models.CASCADE)
    publications = models.ForeignKey('Publications', on_delete=models.CASCADE)
    texte = models.TextField()
    ajoutsDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ID


class Vote(models.Model):
    ID = models.AutoField(primary_key=True)
    user = models.ForeignKey('Account.User', on_delete=models.CASCADE)
    publications = models.ForeignKey('Publications', on_delete=models.CASCADE)
    note = models.IntegerField(validators=[
        MaxValueValidator(5),
        MinValueValidator(0)
    ])

    class Meta:
        unique_together = ('user', 'publications')

    def __str__(self):
        return self.ID


class Concours(models.Model):
    ID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.TextField()
    startDate = models.DateField()
    endDate = models.DateField()

    def __str__(self):
        return self.name
