from rest_framework import serializers

from accounts.api.v1.serializers import UserFullSerializer
from message.models import Message


class MessageSerializer(serializers.ModelSerializer):
    user = UserFullSerializer()

    class Meta:
        model = Message
        fields = ('id', 'user', 'sended', 'message',)
        read_only_fields = ('id', 'sended',)
