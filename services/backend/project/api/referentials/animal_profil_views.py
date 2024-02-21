from flask import request
from flask_restplus import Resource, fields, Namespace, reqparse
from project.repository.referentials.services import get_animal_profiles

animal_profile_namespace = Namespace("animal_profiles")

batch_type = animal_profile_namespace.model('BatchType', {
    "id": fields.Integer,
    "code": fields.String,
    "name": fields.String,
    "UE_value_considered": fields.String,
    "energetic_value_considered": fields.String,
})

animal_profil_period = animal_profile_namespace.model("Animalprofil_period", {
    "id": fields.Integer,
    "period_id": fields.Integer,
    "CI": fields.Float,
    "UFL": fields.Float,
    "PDI": fields.Float,
    "PL": fields.Float,
})

animal_profile_fields = {
    "id": fields.Integer,
    "batch_type_id": fields.Integer,
    "code": fields.String,
    "name": fields.String,
    "period_MB": fields.String,
    "age_mois": fields.String,
    "sem_MB": fields.Integer,
    "weight_MB_kg": fields.Float,
    "NEC_MB": fields.Float,
    "lactation_duration": fields.Float,
    "weight_birth_kg": fields.Float,
    "milk_product_kg": fields.Float,
    "TR": fields.Float,
    "batch_type": fields.Nested(batch_type),
    "animal_profil_periods": fields.List(fields.Nested(animal_profil_period)),
}

animal_profile = animal_profile_namespace.model(
    "AnimalProfil", animal_profile_fields)


class AnimalProfileList(Resource):
    @animal_profile_namespace.marshal_with(animal_profile, as_list=True)
    @animal_profile_namespace.response(200, "Success")
    @animal_profile_namespace.response(400, "Bad request")
    @animal_profile_namespace.response(404, "Animal profiles not found for the given parameters")
    def get(self):
        """Returns animal profiles."""
        parser = reqparse.RequestParser()
        parser.add_argument('batchTypeId', type=int, required=True)
        args = parser.parse_args(strict=True)

        batch_type_id = args['batchTypeId']

        profiles = get_animal_profiles(batch_type_id=batch_type_id)
        if not profiles:
            animal_profile_namespace.abort(
                404, f"Animal profiles not found for batch type ID {batch_type_id}")
        return profiles, 200


animal_profile_namespace.add_resource(AnimalProfileList, '')
