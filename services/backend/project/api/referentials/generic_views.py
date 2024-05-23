from flask_restplus import Resource, fields, Namespace, marshal_with, reqparse
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

batch_type = generic_namespace.model('BatchType', {
    "id": fields.Integer,
    "code": fields.String,
    "name": fields.String,
    "UE_value_considered": fields.String,
    "UF_value_considered": fields.String,
    "UF_concentrated_value_considered": fields.String,
})

animal_profile_period = generic_namespace.model("AnimalProfilePeriod", {
    "period_id": fields.Integer,
    "CI": fields.Float,
    "UFL": fields.Float,
    "PDI": fields.Float,
    "PL": fields.Float,
})
stic_period_fields = generic_namespace.model("Stic_period", {
    "id": fields.Integer,
    "period_id": fields.Integer,
    "production": fields.Float,
    "farming_method": fields.String,
})

site = generic_namespace.model("Site", {
    "id": fields.Integer,
    "name": fields.String,
    "code": fields.String,
})

climatic_year = generic_namespace.model("ClimaticYear", {
    "id": fields.Integer,
    "name": fields.String,
    "code": fields.String,
})

pasture_type = generic_namespace.model("PastureType", {
    "id": fields.Integer,
    "name": fields.String,
    "code": fields.String,
    "nutritional_values": fields.Nested(nutritional_values_fields),
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
    "feed_type": {
        "model_name": "FeedType",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
            "correspondingStock": fields.String,
            "nutritional_values": fields.Nested(nutritional_values_fields)
        }
    },
    "concentrated_feed": {
        "model_name": "ConcentratedFeed",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
            "correspondingStock": fields.String,
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
    "batch_type": {
        "model_name": "BatchType",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
        }
    },
    "housing_type": {
        "model_name": "HousingType",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
        }
    },
    "climatic_year": {
        "model_name": "ClimaticYear",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
            "site_id": fields.Integer,
        }
    },
    "animal_profile": {
        "model_name": "AnimalProfile",
        "fields": {
            "id": fields.Integer,
            "batch_type_id": fields.Integer,
            "code": fields.String,
            "name": fields.String,
            "period_MB": fields.String,
            "age_mois": fields.String,
            "sem_MB": fields.String,
            "weight_MB_kg": fields.Float,
            "NEC_MB": fields.Float,
            "lactation_duration": fields.String,
            "weight_birth_kg": fields.Float,
            "milk_product_kg": fields.Float,
            "TR": fields.Float,
            "batch_type": fields.Nested(batch_type),
            "animal_profile_periods": fields.List(fields.Nested(animal_profile_period)),
        }
    },
    "stic": {
        "model_name": "Stic",
        "fields": {
            "id": fields.Integer,
            "climatic_year_id": fields.Integer,
            # "pasture_type_id": fields.Integer,
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
            "pasture_type": fields.Nested(pasture_type),
        }
    },
    "pasture_type": {
        "model_name": "PastureType",
        "fields": {
            "id": fields.Integer,
            "name": fields.String,
            # "nutritional_values": fields.Nested(nutritional_values_fields)
        }
    }
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
        parser = reqparse.RequestParser()
        parser.add_argument('lastConnectionDate', type=str)
        args = parser.parse_args(strict=True)

        lastConnectionDate = args['lastConnectionDate']

        if modelName not in available_models:
            generic_namespace.abort(404, f"Model {modelName} not found")

        model = models[modelName]
        data = get_all(available_models[modelName]['model_name'],
                       lastConnectionDate)
        # if not data:
        #     generic_namespace.abort(404, f"Models not found for {modelName}")

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
