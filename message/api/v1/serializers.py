from rest_framework import serializers

from accounts.api.v1.serializers import UserFullSerializer
from message.models import Message
from room.models import Room


class MessageSerializer(serializers.ModelSerializer):
    user = UserFullSerializer()
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())

    class Meta:
        model = Message
        fields = ('id', 'user', 'sended', 'message', 'room',)
        read_only_fields = ('id', 'sended',)
