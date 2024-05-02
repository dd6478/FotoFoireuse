from django.db import models
from django.contrib.auth.models import User
from PIL import Image
from django.conf.urls.static import static


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Delete profile when user is deleted
    image = models.ImageField(default='default.jpg', upload_to='profile_pics', null=True, blank=True)

    def save(self):
        super().save()

        img = Image.open(self.image.path)  # Open image

        # resize image
        if img.height > 50 or img.width > 50:
            output_size = (50, 50)
            img.thumbnail(output_size)  # Resize image
            img.save(self.image.path)  # Save it again and overwrite the Larger image

    @property
    def get_image(self):
        return self.image.url if self.image else static('default.jpg')

    def __str__(self):
        return f'{self.user.username} Profile'  # show how we want it to be displayed
