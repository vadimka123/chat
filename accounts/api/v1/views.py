from rest_framework import generics, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.serializers import JSONWebTokenSerializer, RefreshJSONWebTokenSerializer
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.views import JSONWebTokenAPIView

from . import serializers
from accounts.models import CustomUser


jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_response_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER


class UserListView(generics.ListAPIView):
    authentication_classes = (JSONWebTokenAuthentication, SessionAuthentication,)

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.UserFullSerializer

    def get_queryset(self):
        return CustomUser.objects.exclude(id=self.request.user.id)


class ObtainJSONWebToken(JSONWebTokenAPIView):
    serializer_class = JSONWebTokenSerializer


class UserCreate(generics.CreateAPIView):
    authentication_classes = (JSONWebTokenAuthentication,
                              SessionAuthentication,)
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = serializers.UserCreateSerializer


class RefreshJSONWebToken(JSONWebTokenAPIView):
    serializer_class = RefreshJSONWebTokenSerializer
