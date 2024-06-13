# services/users/project/api/ping.py


import jwt
from functools import wraps

from flask import request
from flask_restplus import Namespace, Resource, fields

from project import bcrypt
from project.repository.users.models import User
from project.api.utils.decorators import authorization_required

from project.repository.users.services import (get_Authorizations)  # noqa isort:skip


authorization_namespace = Namespace("authorization")

authorization = authorization_namespace.model("Authorization", {
    "id": fields.Integer,
    "name": fields.String,
})


class AuthorizationList(Resource):
    @authorization_namespace.marshal_with(authorization, as_list=True)
    @authorization_namespace.response(201, "Success")
    @authorization_required('admin')
    def get(self):
        authorizations = get_Authorizations()
        if not authorizations:
            authorization_namespace.abort(
                404, f"Authorizations not found")
        return authorizations, 200


authorization_namespace.add_resource(AuthorizationList, "")
