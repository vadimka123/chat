from django.db.models import Q

from rest_framework import generics, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from . import serializers
from room.models import Room


class RoomListCreateView(generics.ListCreateAPIView):
    authentication_classes = (JSONWebTokenAuthentication, SessionAuthentication,)

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.RoomSerializer

    def get_queryset(self):
        return Room.objects.filter(Q(created_at=self.request.user) | Q(private=False)).select_related(
            'created_at', ).prefetch_related('allowed_users', 'messages', 'messages__user')
