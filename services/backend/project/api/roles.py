# services/users/project/api/ping.py


import jwt
from functools import wraps

from flask import request
from flask_restplus import Namespace, Resource, fields

from project import bcrypt
from project.repository.users.models import User
from project.api.utils.decorators import authorization_required

from project.repository.users.services import (get_Authorizations)  # noqa isort:skip


role_namespace = Namespace("role")

authorization = role_namespace.model("Authorization", {
    "id": fields.Integer,
    "name": fields.String,
})


class AuthorizationList(Resource):
    @role_namespace.marshal_with(authorization, as_list=True)
    @role_namespace.response(201, "Success")
    @role_namespace.response(400, "Sorry. That email already exists.")
    @authorization_required('admin')
    def get(self):
        roles = get_Authorizations()
        if not roles:
            role_namespace.abort(
                404, f"Authorizations not found")
        return roles, 200


role_namespace.add_resource(AuthorizationList, "")
