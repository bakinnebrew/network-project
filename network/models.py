from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime, timedelta


class User(AbstractUser):
    pass


class Post(models.Model):
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="posters")
    post_content = models.TextField(max_length=160, blank=True)
    post_time = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "author": self.user.username,
            "content": self.post_content,
            "timestamp": self.post_time.strftime("%b %-d %Y, %-I:%M %p")
        }


class Follower(models.Model):
    main_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="users")
    followers = models.ManyToManyField(
        User, blank=True, related_name="following"
    )
