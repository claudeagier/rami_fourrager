# services/users/project/api/users/views.py


from flask import request
from flask_restplus import Resource, fields, Namespace
from project.api.utils.decorators import authorization_required
from project.repository.users.models import Authorization

from project.repository.users.services import (
    get_all_users,
    get_user_by_email,
    add_user,
    get_user_by_id,
    update_user,
    delete_user,
    get_authorization_by_id
    # get_authorization_by_name
)


users_namespace = Namespace("users")


class AuthorizationName(fields.Raw):
    def format(self, value):
        return value.name


authorization = users_namespace.model("Authorization", {
    "name": fields.String(required=True)
})
user = users_namespace.model(
    "User",
    {
        "id": fields.Integer(readOnly=True),
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "authorization": AuthorizationName(attribute='authorization')

        # "created_date": fields.DateTime,
    },
)

user_post = users_namespace.inherit(
    "User authorization",
    user,
    {
        "password": fields.String(required=True),
        # "role": fields.String(required=True)
    }
)


class UsersList(Resource):
    @users_namespace.marshal_with(user, as_list=True)
    @authorization_required('admin')
    def get(self):
        """Returns all users."""
        return get_all_users(), 200

    @users_namespace.expect(user_post, validate=True)
    @users_namespace.response(201, "<user_email> was added!")
    @users_namespace.response(400, "Sorry. That email already exists.")
    @authorization_required('admin')
    def post(self):
        """Creates a new user."""
        post_data = request.get_json()
        username = post_data.get("username")
        email = post_data.get("email")
        password = post_data.get("password")
        authorization_id = post_data.get("authorization")
        # authorization_name = post_data.get("authorization")

        authorization = get_authorization_by_id(authorization_id)
        # authorization = get_authorization_by_name(authorization_name)
        if not authorization:
            response_object["message"] = "Sorry, that authorization doesn't exist"
            return response_object, 400

        response_object = {}

        user = get_user_by_email(email)
        if user:
            response_object["message"] = "Sorry. That email already exists."
            return response_object, 400

        add_user(username, email, password, authorization)
        response_object["message"] = f"{email} was added!"
        return response_object, 201


class Users(Resource):
    @users_namespace.marshal_with(user)
    @users_namespace.response(200, "Success")
    @users_namespace.response(404, "User <user_id> does not exist")
    @authorization_required('admin')
    def get(self, user_id):
        """Returns a single user."""
        user = get_user_by_id(user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")
        return user, 200

    @users_namespace.expect(user, validate=True)
    @users_namespace.response(200, "<user_is> was updated!")
    @users_namespace.response(404, "User <user_id> does not exist")
    def put(self, user_id):
        """Updates a user."""
        post_data = request.get_json()
        username = post_data.get("username")
        email = post_data.get("email")
        authorization_id = post_data.get("authorization")
        authorization = get_authorization_by_id(authorization_id)

        response_object = {}

        user = get_user_by_id(user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")
        update_user(user, username, email, authorization)
        response_object["message"] = f"{user.id} was updated!"
        return response_object, 200

    @users_namespace.response(200, "<user_is> was removed!")
    @users_namespace.response(404, "User <user_id> does not exist")
    @authorization_required('admin')
    def delete(self, user_id):
        """Updates a user."""
        response_object = {}
        user = get_user_by_id(user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")
        delete_user(user)
        response_object["message"] = f"{user.email} was removed!"
        return response_object, 200


users_namespace.add_resource(UsersList, "")
users_namespace.add_resource(Users, "/<int:user_id>")
