from rest_framework import serializers

from accounts.api.v1.serializers import UserFullSerializer
from room.models import Room


class RoomSerializer(serializers.ModelSerializer):
    allowed_users = UserFullSerializer(many=True, allow_null=True)

    class Meta:
        model = Room
        fields = ('created', 'name', 'private', 'allowed_users',)
        read_only_fields = ('created',)
