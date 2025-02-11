# services/users/project/api/auth.py


import jwt
from functools import wraps

from flask import request
from flask_restplus import Namespace, Resource, fields

from project import bcrypt
from project.repository.users.models import User
from project.api.utils.decorators import authorization_required

from project.repository.users.services import (get_user_by_email, get_user_by_id, add_user, get_Authorizations)  # noqa isort:skip

auth_namespace = Namespace("auth")


authorization = auth_namespace.model("Authorization", {
    "id": fields.Integer(readOnly=True),
    "name": fields.String(required=True)
})

user = auth_namespace.model(
    "User",
    {
        "id": fields.Integer(readOnly=True),
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "authorization": fields.Nested(authorization)
    },
)

full_user = auth_namespace.inherit(
    "Full User", user, {"password": fields.String(required=True)}
)


login = auth_namespace.model(
    "User",
    {"email": fields.String(required=True),
     "password": fields.String(required=True)},
)

refresh = auth_namespace.model(
    "Refresh", {"refresh_token": fields.String(required=True)}
)

tokens = auth_namespace.inherit(
    "Access and refresh_tokens", refresh, {
        "access_token": fields.String(required=True)}
)

parser = auth_namespace.parser()
parser.add_argument("Authorization", location="headers")


# class Register(Resource):
#     @auth_namespace.marshal_with(user)
#     @auth_namespace.expect(full_user, validate=True)
#     @auth_namespace.response(201, "Success")
#     @auth_namespace.response(400, "Sorry. That email already exists.")
#     # TODO-BACK Ajoutez le décorateur pour vérifier l'authentification admin
#     @authorization_required('admin')
#     def post(self):
#         post_data = request.get_json()
#         username = post_data.get("username")
#         email = post_data.get("email")
#         password = post_data.get("password")

#         user = get_user_by_email(email)
#         if user:
#             auth_namespace.abort(400, "Sorry. That email already exists.")
#         user = add_user(username, email, password)
#         return user, 201


class Login(Resource):
    @auth_namespace.marshal_with(tokens)
    @auth_namespace.expect(login, validate=True)
    @auth_namespace.response(200, "Success")
    @auth_namespace.response(404, "User does not exist")
    def post(self):
        post_data = request.get_json()
        email = post_data.get("email")
        password = post_data.get("password")
        response_object = {}

        user = get_user_by_email(email)
        if not user or not bcrypt.check_password_hash(user.password, password):
            auth_namespace.abort(404, "User does not exist")
        access_token = user.encode_token(user.id, "access")
        refresh_token = user.encode_token(user.id, "refresh")

        response_object = {
            # "user": user,
            "access_token": access_token.decode(),
            "refresh_token": refresh_token.decode(),
        }
        return response_object, 200


class Refresh(Resource):
    @auth_namespace.marshal_with(tokens)
    @auth_namespace.expect(refresh, validate=True)
    @auth_namespace.response(200, "Success")
    @auth_namespace.response(401, "Invalid token")
    def post(self):
        post_data = request.get_json()
        refresh_token = post_data.get("refresh_token")
        response_object = {}

        try:
            resp = User.decode_token(refresh_token)
            user = get_user_by_id(resp['user_id'])
            if not user:
                auth_namespace.abort(401, "Invalid token")
            access_token = user.encode_token(user.id, "access")
            refresh_token = user.encode_token(user.id, "refresh")

            response_object = {
                "access_token": access_token.decode(),
                "refresh_token": refresh_token.decode(),
            }
            return response_object, 200
        except jwt.ExpiredSignatureError:
            auth_namespace.abort(
                401, "Signature expired. Please log in again.")
            return "Signature expired. Please log in again."
        except jwt.InvalidTokenError:
            auth_namespace.abort(401, "Invalid token. Please log in again.")


class Status(Resource):
    @auth_namespace.marshal_with(user)
    @auth_namespace.response(200, "Success")
    @auth_namespace.response(401, "Invalid token")
    @auth_namespace.expect(parser)
    def get(self):
        auth_header = request.headers.get("Authorization")
        if auth_header:
            try:
                access_token = auth_header
                resp = User.decode_token(access_token)
                user = get_user_by_id(resp['user_id'])
                if not user:
                    auth_namespace.abort(401, "Invalid token")
                return user, 200
            except jwt.ExpiredSignatureError:
                auth_namespace.abort(
                    401, "Signature expired. Please log in again.")
                return "Signature expired. Please log in again."
            except jwt.InvalidTokenError:
                auth_namespace.abort(
                    401, "Invalid token. Please log in again.")
        else:
            auth_namespace.abort(401, "Token required")


# auth_namespace.add_resource(Register, "/register")
auth_namespace.add_resource(Login, "/login")
auth_namespace.add_resource(Refresh, "/refresh")
auth_namespace.add_resource(Status, "/status")
