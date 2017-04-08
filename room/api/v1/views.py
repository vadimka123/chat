from django.db.models import Q

from rest_framework import generics, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from . import serializers
from accounts.models import CustomUser
from room.models import Room


class RoomListCreateView(generics.ListCreateAPIView):
    authentication_classes = (JSONWebTokenAuthentication, SessionAuthentication,)

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.RoomSerializer

    def get_queryset(self):
        return Room.objects.filter(Q(created_at=self.request.user) | Q(private=False) | Q(
            allowed_users__id__contains=self.request.user)).select_related('created_at', ).prefetch_related(
            'allowed_users', 'messages', 'messages__user').distinct()

    def perform_create(self, serializer):
        allowed_users = self.request.data['allowed_users']
        allowed_users = CustomUser.objects.filter(id__in=allowed_users) if allowed_users else None
        serializer.save(allowed_users=allowed_users, created_at=self.request.user)
