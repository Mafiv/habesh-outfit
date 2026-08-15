import jwt
import requests
from django.conf import settings
from rest_framework import authentication, exceptions
from jwt import PyJWKClient


class BetterAuthUser:
    def __init__(self, payload):
        self.id = payload.get('id') or payload.get('sub')
        self.email = payload.get('email', '')
        self.name = payload.get('name', '')
        self.is_authenticated = True

    def __str__(self):
        return self.email


_jwks_client = None


def get_jwks_client():
    global _jwks_client
    if _jwks_client is None:
        jwks_url = f'{settings.BETTER_AUTH_URL}/api/auth/jwks'
        _jwks_client = PyJWKClient(jwks_url)
    return _jwks_client


class BetterAuthJWTAuthentication(authentication.BaseAuthentication):
    """Verify JWT tokens issued by the Better Auth service."""

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ', 1)[1]
        payload = self._decode_token(token)

        user_id = payload.get('id') or payload.get('sub')
        if not user_id:
            raise exceptions.AuthenticationFailed('Token missing user id')

        return (BetterAuthUser(payload), token)

    def _decode_token(self, token):
        # Try shared secret (HS256)
        try:
            return jwt.decode(
                token,
                settings.BETTER_AUTH_SECRET,
                algorithms=['HS256', 'HS384', 'HS512'],
                options={'verify_aud': False},
            )
        except jwt.PyJWTError:
            pass

        # Try JWKS (asymmetric keys from Better Auth JWT plugin)
        try:
            client = get_jwks_client()
            signing_key = client.get_signing_key_from_jwt(token)
            return jwt.decode(
                token,
                signing_key.key,
                algorithms=['EdDSA', 'RS256', 'ES256', 'ES384', 'ES512'],
                options={'verify_aud': False},
            )
        except Exception as exc:
            raise exceptions.AuthenticationFailed(f'Invalid token: {exc}') from exc
