# services/users/project/api/services.py

from sqlalchemy.orm import joinedload

from project import db
from project.repository.referentials.models import Stic, ClimaticYear, Site, PastureType, NutritionalValues, AnimalProfil, BatchType, AnimalProfilPeriod, Period
from project.repository.connector import getModel


def get_all(modelName):
    model = getModel('referential', model_name=modelName)
    all = model.query.all()
    return all


def get_by_id(modelName, id):
    model = getModel('referential', model_name=modelName)
    t = model.query.filter_by(**{"id": id}).first()
    return t


def get_stics_by(climaticYearId):
    stics = db.session.query(Stic).filter_by(
        **{'climatic_year_id': climaticYearId}).options(joinedload('*')).all()
    return stics


def get_animal_profiles(batch_type_id):
    profiles = db.session.query(AnimalProfil).filter_by(
        **{'batch_type_id': batch_type_id}).options(joinedload('*')).all()
    return profiles
