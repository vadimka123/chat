from django.db import models

from accounts.models import CustomUser


class Message(models.Model):
    user = models.ForeignKey(CustomUser, related_name='messages')
    room = models.ForeignKey('room.Room', blank=False, null=False, related_name='messages')
    sended = models.DateTimeField(auto_now_add=True)
    message = models.TextField(max_length=1024, null=False, blank=False)
