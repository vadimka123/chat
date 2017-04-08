from rest_framework import serializers

from accounts.api.v1.serializers import UserFullSerializer
from accounts.models import CustomUser
from message.api.v1.serializers import MessageSerializer
from room.models import Room


class RoomSerializer(serializers.ModelSerializer):
    allowed_users = UserFullSerializer(many=True, allow_null=True, read_only=True)
    created_at = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ('id', 'created', 'name', 'created_at', 'private', 'allowed_users', 'messages',)
        read_only_fields = ('id', 'created',)
