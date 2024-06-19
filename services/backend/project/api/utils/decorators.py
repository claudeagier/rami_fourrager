import jwt
from functools import wraps
from flask import request, abort
from project.repository.users.models import User
from project.repository.users.services import get_user_by_id  # noqa isort:skip


def authorization_required(authorization):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if auth_header:
                try:
                    access_token = auth_header
                    resp = User.decode_token(access_token)
                    user = get_user_by_id(resp['user_id'])
                    if not user or user.authorization.name != resp['authorization'] or user.authorization.name != authorization:
                        abort(
                            403, f"Permission denied. {authorization} access required.")
                    return f(*args, **kwargs)
                except jwt.ExpiredSignatureError:
                    abort(401, "Signature expired. Please log in again.")
                except jwt.InvalidTokenError:
                    abort(401, "Invalid token. Please log in again.")
            else:
                abort(403, "Token required")
        return decorated_function
    return decorator
