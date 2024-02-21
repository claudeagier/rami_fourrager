# services/users/project/api/__init__.py


from flask_restplus import Api

from project.api.auth import auth_namespace
from project.api.users.views import users_namespace
from project.api.referentials.stic_views import stics_namespace
from project.api.referentials.animal_profil_views import animal_profile_namespace
from project.api.referentials.generic_views import generic_namespace


api = Api(version="1.0", title="Rami fourrager API", doc="/swagger")

api.add_namespace(users_namespace, path="/users")
api.add_namespace(auth_namespace, path="/auth")
api.add_namespace(stics_namespace, path="/stics")
api.add_namespace(animal_profile_namespace, path="/animal-profiles")
api.add_namespace(generic_namespace, path="/lists")
