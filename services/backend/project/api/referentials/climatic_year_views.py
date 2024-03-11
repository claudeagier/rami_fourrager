from flask import request
from flask_restplus import Resource, fields, Namespace, reqparse
from project.repository.referentials.services import (get_climaticYear_by)


climatic_year_namespace = Namespace("stics")

site = climatic_year_namespace.model("Site", {
    "id": fields.Integer,
    "name": fields.String,
    "code": fields.String,
})

climatic_year = climatic_year_namespace.model("ClimaticYear", {
    "id": fields.Integer,
    "name": fields.String,
    "code": fields.String,
    "site": fields.Nested(site),
})


class ClimaticYearList(Resource):
    @climatic_year_namespace.marshal_with(climatic_year, as_list=True)
    @climatic_year_namespace.response(200, "Success")
    @climatic_year_namespace.response(400, "Bad request")
    @climatic_year_namespace.response(404, "Stics not found for the given parameters")
    def get(self):
        """Returns climatic years."""
        parser = reqparse.RequestParser()
        parser.add_argument('siteId', type=int, required=True)
        args = parser.parse_args(strict=True)

        siteId = args['siteId']

        years = get_climaticYear_by(siteId=siteId)
        if not years:
            climatic_year_namespace.abort(
                404, f"Stics not found for climatic year {siteId}")
        return years, 200


climatic_year_namespace.add_resource(ClimaticYearList, "")
