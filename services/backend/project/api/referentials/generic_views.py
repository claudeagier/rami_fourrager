from flask_restplus import Resource, fields, Namespace, marshal_with
from project.repository.referentials.services import get_all, get_by_id

generic_namespace = Namespace("generic")
nutritional_values_fields = generic_namespace.model("Nutritional_values", {
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

# Définition des modèles disponibles
available_models = {
    "site": {
        "model_name": "Site",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
        }
    },
    "feed-type": {
        "model_name": "FeedType",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
            "nutritional_values": fields.Nested(nutritional_values_fields)
        }
    },
    "concentrated-feed": {
        "model_name": "ConcentratedFeed",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
            "nutritional_values": fields.Nested(nutritional_values_fields)

        }
    },
    "period": {
        "model_name": "period",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
        }
    },
    "batch-type": {
        "model_name": "BatchType",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
        }
    },
    "housing-type": {
        "model_name": "HousingType",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
        }
    },
    "climatic-year": {
        "model_name": "ClimaticYear",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
        }
    },
    # Ajoutez d'autres modèles avec leurs champs correspondants si nécessaire
}

# Création des modèles de données pour chaque modèle
models = {}
for model_name, model_data in available_models.items():
    models[model_name] = generic_namespace.model(
        model_data['model_name'], model_data["fields"])


class GenericModelList(Resource):
    @generic_namespace.response(200, "Success")
    @generic_namespace.response(404, "Models not found")
    def get(self, modelName):
        """Returns all instances of a given model."""
        if modelName not in available_models:
            generic_namespace.abort(404, f"Model {modelName} not found")

        model = models[modelName]
        data = get_all(available_models[modelName]['model_name'])
        if not data:
            generic_namespace.abort(404, f"Models not found for {modelName}")

        @marshal_with(model)
        def response():
            return data

        return response(), 200


class GenericModelDetail(Resource):
    @generic_namespace.response(200, "Success")
    @generic_namespace.response(404, "Model not found")
    def get(self, modelName, id):
        """Returns a specific instance of a given model by ID."""
        if modelName not in available_models:
            generic_namespace.abort(404, f"Model {modelName} not found")

        model_fields = available_models[modelName]["fields"]
        model = models[modelName]

        model_instance = get_by_id(modelName.capitalize(), id)
        if not model_instance:
            generic_namespace.abort(404, f"Model not found for ID {id}")

        @marshal_with(model)
        def response():
            return model_instance

        return response(), 200


generic_namespace.add_resource(GenericModelList, "/<string:modelName>")
generic_namespace.add_resource(
    GenericModelDetail, "/<string:modelName>/<int:id>")
