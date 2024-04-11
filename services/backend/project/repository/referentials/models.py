from project import db, bcrypt


class Period(db.Model):
    __tablename__ = 'period'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    code = db.Column(db.String(255))  # son propore code
    name = db.Column(db.String(255))
    start_at = db.Column(db.String(100))
    end_at = db.Column(db.String(100))
    stic_periods = db.relationship('SticPeriod', backref='period', lazy=True)
    animal_profil_periods = db.relationship(
        'AnimalProfilPeriod', backref='period', lazy=True)


class SticPeriod(db.Model):
    __tablename__ = 'stic_period'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    period_id = db.Column(db.Integer, db.ForeignKey('period.id'))
    stic_id = db.Column(db.Integer, db.ForeignKey('stic.id'))
    production = db.Column(db.Numeric, default=0)
    farming_method = db.Column(db.String(10))


class Stic(db.Model):
    __tablename__ = 'stic'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    climatic_year_id = db.Column(db.Integer, db.ForeignKey('climatic_year.id'))
    pasture_type_id = db.Column(db.Integer, db.ForeignKey('pasture_type.id'))
    code = db.Column(db.String(255))  # son propre code
    name = db.Column(db.String(255))
    type = db.Column(db.String(255))
    rendement = db.Column(db.String(255))
    designation = db.Column(db.String(255))
    RU = db.Column(db.String(255))
    IN = db.Column(db.String(255))
    ITK = db.Column(db.String(255))
    detail_ITK = db.Column(db.String(255))
    stic_periods = db.relationship('SticPeriod', backref='stic', lazy=True)


class Site(db.Model):
    __tablename__ = 'site'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255))
    code = db.Column(db.String(255))  # son propre code
    climatic_years = db.relationship('ClimaticYear', backref='site', lazy=True)


class ClimaticYear(db.Model):
    __tablename__ = 'climatic_year'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255))
    code = db.Column(db.String(255))  # son code
    site_id = db.Column(db.Integer, db.ForeignKey('site.id'))
    stics = db.relationship('Stic', backref='climatic_year', lazy=True)


class PastureType(db.Model):
    __tablename__ = 'pasture_type'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nutritional_values_id = db.Column(
        db.Integer, db.ForeignKey('nutritional_values.id'))
    name = db.Column(db.String(255))
    code = db.Column(db.String(255))  # son code
    stics = db.relationship('Stic', backref='pasture_type', lazy=True)


class ConcentratedFeed(db.Model):
    __tablename__ = 'concentrated_feed'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nutritional_values_id = db.Column(
        db.Integer, db.ForeignKey('nutritional_values.id'))
    name = db.Column(db.String(255))
    code = db.Column(db.String(255))  # son code
    correspondingStock = db.Column(db.String(255))  # son code

# class Straw(db.Model):
#     __tablename__ = 'straw'

#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     nutritional_values_id = db.Column(db.Integer, db.ForeignKey('nutritional_values.id'))
#     name = db.Column(db.String(255))


class FeedType(db.Model):
    __tablename__ = 'feed_type'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nutritional_values_id = db.Column(
        db.Integer, db.ForeignKey('nutritional_values.id'))
    name = db.Column(db.String(255))
    code = db.Column(db.String(255))  # son code
    correspondingStock = db.Column(db.String(255))  # son code

# à minorer pour les VA (=vache allaitantes)


class NutritionalValues(db.Model):
    __tablename__ = 'nutritional_values'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UEL = db.Column(db.Numeric, default=0)
    UEB = db.Column(db.Numeric, default=0)
    UEM = db.Column(db.Numeric, default=0)
    UFL = db.Column(db.Numeric, default=0)
    PDI_inf = db.Column(db.Numeric, default=0)
    UFV = db.Column(db.Numeric, default=0)
    PDIN = db.Column(db.Numeric, default=0)
    PDIE = db.Column(db.Numeric, default=0)
    rejection = db.Column(db.Numeric, default=0)
    source = db.Column(db.String(255))
    pasture_types = db.relationship(
        'PastureType', backref='nutritional_values', lazy=True)
    concentrated_feeds = db.relationship(
        'ConcentratedFeed', backref='nutritional_values', lazy=True)
    # straws = db.relationship('Straw', backref='nutritional_values', lazy=True)
    feed_types = db.relationship(
        'FeedType', backref='nutritional_values', lazy=True)


class AnimalProfilPeriod(db.Model):
    __tablename__ = 'animal_profil_period'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    period_id = db.Column(db.Integer, db.ForeignKey('period.id'))
    animal_profil_id = db.Column(db.Integer, db.ForeignKey('animal_profil.id'))
    CI = db.Column(db.Numeric, default=0)
    UFL = db.Column(db.Numeric, default=0)
    PDI = db.Column(db.Numeric, default=0)
    PL = db.Column(db.Numeric, default=0)


class AnimalProfil(db.Model):
    __tablename__ = 'animal_profil'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    batch_type_id = db.Column(db.Integer, db.ForeignKey('batch_type.id'))
    code = db.Column(db.String(255))  # son code
    name = db.Column(db.String(255))
    period_MB = db.Column(db.String(255))
    age_mois = db.Column(db.String(100))
    sem_MB = db.Column(db.String(100))
    weight_MB_kg = db.Column(db.Numeric, default=0)
    NEC_MB = db.Column(db.Numeric, default=0)
    lactation_duration = db.Column(db.String(100))
    weight_birth_kg = db.Column(db.Numeric, default=0)
    milk_product_kg = db.Column(db.Numeric, default=0)
    TR = db.Column(db.Numeric, default=0)
    animal_profil_periods = db.relationship(
        'AnimalProfilPeriod', backref='AnimalProfil', lazy=True)


class BatchType(db.Model):
    __tablename__ = 'batch_type'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    code = db.Column(db.String(255))  # son code
    name = db.Column(db.String(255))
    UE_value_considered = db.Column(db.String(255))
    UF_value_considered = db.Column(db.String(255))
    UF_concentrated_value_considered = db.Column(db.String(255))
    animal_profils = db.relationship(
        'AnimalProfil', backref='batch_type', lazy=True)


class HousingType(db.Model):
    __tablename__ = 'housing_type'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255))
    code = db.Column(db.String(255))  # son code
    straw_requirement = db.Column(db.Numeric, default=0)
