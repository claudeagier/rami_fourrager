# services/users/project/api/__init__.py


from flask_restplus import Api

from project.api.auth import auth_namespace
from project.api.users.views import users_namespace
from project.api.referentials.generic_views import generic_namespace
from project.api.authorizations import authorization_namespace


api = Api(version="1.0", title="Rami fourrager API", doc="/swagger")

api.add_namespace(users_namespace, path="/users")
api.add_namespace(auth_namespace, path="/auth")
api.add_namespace(generic_namespace, path="/lists")
api.add_namespace(authorization_namespace, path="/authorizations")
