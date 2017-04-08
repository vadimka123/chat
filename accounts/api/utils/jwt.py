from datetime import datetime
from calendar import timegm
from rest_framework_jwt.settings import api_settings


def jwt_payload_handler(user):
    if isinstance(user, dict):
        payload = user
    else:
        user.last_client_login = datetime.utcnow()
        user.save()
        from accounts.api.v1.serializers import UserFullSerializer
        payload = UserFullSerializer(user).data

    payload['exp'] = datetime.utcnow() + api_settings.JWT_EXPIRATION_DELTA

    if api_settings.JWT_ALLOW_REFRESH:
        payload['orig_iat'] = timegm(
            datetime.utcnow().utctimetuple()
        )

    if api_settings.JWT_AUDIENCE is not None:
        payload['aud'] = api_settings.JWT_AUDIENCE

    if api_settings.JWT_ISSUER is not None:
        payload['iss'] = api_settings.JWT_ISSUER

    return payload


def jwt_get_username_from_payload_handler(payload):
    return payload.get('username')
