from django.conf import settings
from django.db import models
from django.forms.models import model_to_dict
from django.utils.functional import cached_property
from socketIO_client import SocketIO, BaseNamespace
from socketIO_client.exceptions import TimeoutError

from accounts.models import CustomUser


class EmptySocket(object):
    def emit(self, *args, **kwargs):
        pass

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        pass


class Message(models.Model):
    user = models.ForeignKey(CustomUser, related_name='messages')
    room = models.ForeignKey('room.Room', blank=False, null=False, related_name='messages')
    sended = models.DateTimeField(auto_now_add=True)
    message = models.TextField(max_length=1024, null=False, blank=False)

    @cached_property
    def socket_io(self):
        try:
            return SocketIO(settings.WS_SERVER_IP, settings.WS_SERVER_PORT, BaseNamespace, wait_for_connection=False)
        except TimeoutError:
            return EmptySocket()

    def save(self, *args, **kwargs):
        message = super(Message, self).save(*args, **kwargs)

        with self.socket_io:
            data = model_to_dict(self)
            data['user'] = model_to_dict(self.user, fields=('id', 'username',))
            data['room'] = {'id': self.room.id}
            self.socket_io.emit('message_create', data)

        return message

    def __unicode__(self):
        return self.message
