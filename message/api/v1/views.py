from django.db.models import Q

from rest_framework import generics, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from . import serializers
from message.models import Message


class MessageListCreateView(generics.ListCreateAPIView):
    authentication_classes = (JSONWebTokenAuthentication, SessionAuthentication,)

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.MessageSerializer

    def get_queryset(self):
        # TODO!!!
        return Message.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
