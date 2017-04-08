from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_jwt.settings import api_settings

from accounts.models import CustomUser
from accounts.api.utils.jwt import jwt_payload_handler


jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username',)
        read_only_fields = ('username',)


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password1 = serializers.CharField(write_only=True)
    username = serializers.CharField(write_only=True, required=True, allow_null=False, allow_blank=True,
                                     validators=[UniqueValidator(queryset=CustomUser.objects.all())])
    token = serializers.SerializerMethodField()

    def create(self, validated_data):
        user = CustomUser.objects.create(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()

        return user

    @staticmethod
    def get_token(user):
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        return token

    class Meta:
        model = CustomUser
        fields = ('password', 'password1', 'username', 'token',)
        extra_kwargs = {
            'username': {'write_only': True}
        }
