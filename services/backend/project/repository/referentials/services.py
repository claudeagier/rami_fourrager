# services/users/project/api/services.py
from datetime import datetime
from sqlalchemy.orm import joinedload
from sqlalchemy import desc

from project import db
from project.repository.referentials.models import Stic, ClimaticYear, Site, PastureType, NutritionalValues, AnimalProfile, BatchType, AnimalProfilePeriod, Period
from project.repository.connector import getModel


def get_all(modelName, lastConnectionDate=None):

    model = getModel('referential', model_name=modelName)

    if lastConnectionDate in ('null', None):
        return model.query.all()
    else:
        # Assurez-vous que lastConnectionDate est un objet datetime
        last_connection_date = datetime.strptime(
            lastConnectionDate, "%Y-%m-%d %H:%M:%S")
        return model.query.filter(model.updated_at > last_connection_date).all()


def get_by_id(modelName, id):
    model = getModel('referential', model_name=modelName)
    t = model.query.filter_by(**{"id": id}).first()
    return t
