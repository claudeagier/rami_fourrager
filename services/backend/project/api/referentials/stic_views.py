from flask import request
from flask_restplus import Resource, fields, Namespace, reqparse
from project.repository.referentials.services import (get_stics_by)


stics_namespace = Namespace("stics")

stic_period_fields = stics_namespace.model("Stic_period", {
    "id": fields.Integer,
    "period_id": fields.Integer,
    "production": fields.Float,
    "farming_method": fields.String,
})

nutritional_values_fields = stics_namespace.model("Nutritional_values", {
    "id": fields.Integer,
    "UEL": fields.Float,
    "UEB": fields.Float,
    "UEM": fields.Float,
    "UFL": fields.Float,
    "PDI_inf": fields.Float,
    "UFV": fields.Float,
    "PDIN": fields.Float,
    "PDIE": fields.Float,
    "rejection": fields.Float
    # "source": fields.String,
})
site = stics_namespace.model("Site", {
    "id": fields.Integer,
    "name": fields.String,
    "code": fields.String,
})

climatic_year = stics_namespace.model("ClimaticYear", {
    "id": fields.Integer,
    "name": fields.String,
    "code": fields.String,
})

pasture_type = stics_namespace.model("PastureType", {
    "id": fields.Integer,
    "name": fields.String,
    "code": fields.String,
    "nutritional_values": fields.Nested(nutritional_values_fields),
})

stic_fields = {
    "id": fields.Integer,
    "climatic_year_id": fields.Integer,
    "pasture_type_id": fields.Integer,
    "code": fields.String,
    "name": fields.String,
    "type": fields.String,
    "rendement": fields.String,
    "designation": fields.String,
    "RU": fields.String,
    "IN": fields.String,
    "ITK": fields.String,
    "detail_ITK": fields.String,
    "stic_periods": fields.List(fields.Nested(stic_period_fields)),
    "ClimaticYear": fields.Nested(climatic_year),
    "site": fields.Nested(site),
    "pasture_type": fields.Nested(pasture_type),
}

stic = stics_namespace.model("Stic", stic_fields)


class SticsList(Resource):
    @stics_namespace.marshal_with(stic, as_list=True)
    @stics_namespace.response(200, "Success")
    @stics_namespace.response(400, "Bad request")
    @stics_namespace.response(404, "Stics not found for the given parameters")
    def get(self):
        """Returns stics."""
        parser = reqparse.RequestParser()
        parser.add_argument('climaticYearId', type=int, required=True)
        args = parser.parse_args(strict=True)

        climaticYearId = args['climaticYearId']

        stics = get_stics_by(climaticYearId=climaticYearId)
        if not stics:
            stics_namespace.abort(
                404, f"Stics not found for climatic year {climaticYearId}")
        return stics, 200


stics_namespace.add_resource(SticsList, "")
