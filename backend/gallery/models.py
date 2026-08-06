from django.db import models


class InstagramGallery(models.Model):
    image = models.ImageField(upload_to="instagram/")
    instagram_url = models.URLField(blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    

    class Meta:
        ordering = ["display_order"]

    def __str__(self):
        return f"Instagram Image {self.id}"