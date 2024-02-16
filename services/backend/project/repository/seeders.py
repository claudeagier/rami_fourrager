import csv
from project import db
from project.repository.referentials.models import Site, ClimaticYear, BatchType, Period, Stic, SticPeriod, PastureType
from project.repository.users.models import Authorization
from sqlalchemy.exc import IntegrityError

    # mapping = {
    #     "site": "le nom du site",
    #     "annee": "le nom de climatic_year",
    #     "type": "le nom du batch type",
    #     "Abrev_baquettes": "",
    #     "P1": "la valeur de la production",
    #     "P2": "la valeur de la production",
    #     "P3": "la valeur de la production",
    #     "P4": "la valeur de la production",
    #     "P5": "la valeur de la production",
    #     "P6": "la valeur de la production",
    #     "P7": "la valeur de la production",
    #     "P8": "la valeur de la production",
    #     "P9": "la valeur de la production",
    #     "P10": "la valeur de la production",
    #     "P11": "la valeur de la production",
    #     "P12": "la valeur de la production",
    #     "P13": "la valeur de la production",
    #     "M1": "le nom du framing_method",
    #     "M2": "le nom du framing_method",
    #     "M3": "le nom du framing_method",
    #     "M4": "le nom du framing_method",
    #     "M5": "le nom du framing_method",
    #     "M6": "le nom du framing_method",
    #     "M7": "le nom du framing_method",
    #     "M8": "le nom du framing_method",
    #     "M9": "le nom du framing_method",
    #     "M10": "le nom du framing_method",
    #     "M11": "le nom du framing_method",
    #     "M12": "le nom du framing_method",
    #     "M13": "le nom du framing_method",
    #     "rdt_paille": "valeur du rendement",
    #     "Designation_baguettes": "designation de la baguette",
    #     "RU": "valeur RU",
    #     "IN": "valeur IN",
    #     "ITK": "valeur ITK",
    #     "Détail_ITK": "valeur detail itk",
    #     "Type_pature": "le nom du pasture_type"
    # }

def seed_stics_from_csv(csv_file, mapping = {}):
    """_summary_
        add stic to db from csv file
        Attention pas de controle d'unicité
    Args:
        csv_file (path): _description_
        mapping (dict, optional): _description_. Defaults to {}.
    """
    try:
        with open(csv_file, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                site_name = row['site']
                climatic_year_name = row['annee']
                batch_type_name = row['type']
                pasture_type_name = row['Type_pature']

                site = Site.query.filter_by(name=site_name).first()
                climatic_year = ClimaticYear.query.filter_by(name=climatic_year_name).first()
                batch_type = BatchType.query.filter_by(name=batch_type_name).first()
                pasture_type = PastureType.query.filter_by(name=pasture_type_name).first()

                if not all([site, climatic_year, batch_type, pasture_type]):
                    print(f"Some data not found for stic: {row}")
                    continue

                stic_data = {
                    "site_id": site.id,
                    "climatic_year_id": climatic_year.id,
                    "batch_type_id": batch_type.id,
                    "abrev_baquettes": row['Abrev_baquettes'],
                    "rdt_paille": row['rdt_paille'],
                    "designation_baguettes": row['Designation_baguettes'],
                    "RU": row['RU'],
                    "IN": row['IN'],
                    "ITK": row['ITK'],
                    "detail_ITK": row['Détail_ITK'],
                    "pasture_type_id": pasture_type.id
                }

                for i in range(13):
                    period = Period.query.filter_by(name=f"{i+1}").first()
                    if not period:
                        print(f"Period not found for stic: {row}")
                        continue

                    stic_period_data = {
                        "period_id": period.id,
                        "production": row[f'P{i+1}'],
                        "farming_method": row[f'M{i+1}']
                    }

                    stic_period = SticPeriod(**stic_period_data)
                    stic_data[f"period_{i+1}"] = stic_period

                stic = Stic(**stic_data)
                db.session.add(stic)

            db.session.commit()
            print("Seeder completed for stics.")
    except FileNotFoundError:
        print(f"File not found: {csv_file}")
    except Exception as e:
        print(f"Error seeding stics: {e}")

def seed_from_csv(model, csv_file, column_mapping):
    try:
        with open(csv_file, 'r') as file:
            reader = csv.DictReader(file, delimiter=";", quotechar='"')
            for row in reader:
                # Création d'un dictionnaire des données à partir du mapping
                data = {model_field: row[csv_field] for csv_field, model_field in column_mapping.items()}
                
                # Création d'une instance du modèle avec les données du CSV
                instance = model(**data)
                
                # Ajout de l'instance à la session et commit dans la base de données
                db.session.add(instance)
                db.session.commit()
                
                print(f"Data seeded for {model.__name__}.")
    except FileNotFoundError:
        print(f"File not found: {csv_file}")
    except IntegrityError:
        db.session.rollback()
        print(f"IntegrityError for {model.__name__}. Skipping...")
    except Exception as e:
        db.session.rollback()
        print(f"Error seeding {model.__name__}: {e}")
