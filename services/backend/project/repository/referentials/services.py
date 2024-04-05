# services/users/project/api/services.py

from sqlalchemy.orm import joinedload
from sqlalchemy import desc

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
    stics = (
        db.session.query(Stic)
        .filter(Stic.climatic_year_id == climaticYearId)
        .order_by(desc(Stic.type))
        .order_by(desc(Stic.name))  # Tri par name
        .all()
    )
    return stics


def get_climaticYear_by(siteId):
    years = db.session.query(ClimaticYear).filter_by(
        **{'site_id': siteId}).all()
    return years


def get_animal_profiles(batch_type_id):
    profiles = db.session.query(AnimalProfil).filter_by(
        **{'batch_type_id': batch_type_id}).all()
    return profiles
