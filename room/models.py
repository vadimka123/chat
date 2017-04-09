from django.db import models

from accounts.models import CustomUser


class Room(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    created_at = models.ForeignKey(CustomUser, related_name='room')
    private = models.BooleanField(default=True)
    allowed_users = models.ManyToManyField(CustomUser, related_name='rooms', null=True, blank=True)
    name = models.CharField(max_length=256, null=True, blank=False)

    def __unicode__(self):
        return self.name
