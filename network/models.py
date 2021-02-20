from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime, timedelta
from django.core import serializers


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
            "author_id": self.user.id,
            "author": self.user.username,
            "content": self.post_content,
            "timestamp": self.post_time.strftime("%b %-d %Y, %-I:%M %p")
        }


class Follower(models.Model):
    main_user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="followed")
    followers = models.ManyToManyField(
        "User", blank=True, related_name="follower"
    )

    def serialize(self):
        return {
            "id": self.id,
            "main_user_id": self.main_user.username,
            "follower": [user.username for user in self.followers.all()],
        }
