# services/users/manage.py
import os

from flask.cli import FlaskGroup
import click

from project import create_app, db
from project.repository.users.models import User, Authorization

from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database

from werkzeug.utils import secure_filename


app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command('create')
def create_db():
    engine = create_engine(os.environ.get('DATABASE_URL'))

    if not database_exists(engine.url):
        create_database(engine.url)

    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command('init_db')
def seed_db():
    """Seed defulat data to the database."""
    authorizations = [
        Authorization(
            name='user',
            description="user authorization"
        ),
        Authorization(
            name='admin',
            description="admin authorization"
        )
    ]
    db.session.add_all(authorizations)
    db.session.commit()


@cli.command('add_admin_user')
def add_admin_user():
    """seed admin user in database
    """
    # TODO-BACK mettre l'admin user ailleurs
    admin_authorization = db.session.query(Authorization).filter(
        Authorization.name == 'admin').first()
    db.session.add(User(
        username='totoescargot',
        email='toto.escargot@jardin.com',
        password='mangesalade',
        authorization=admin_authorization
    ))
    db.session.commit()


@cli.command('seed')
@click.argument('mapping_filename')
def seed_data(mapping_filename):
    """
    Seed the database with data specified in the provided mapping file.

    Parameters:
    - mapping_filename (str): The name of the JSON mapping file located in the 'referential' directory.

    This command seeds the database with data specified in a JSON mapping file. The mapping file should define
    the relationships between CSV files and corresponding database models along with column mappings.

    Example:
    $ python manage.py seed_data mapping_1.json

    This command will seed the database using the mapping defined in 'mapping_1.json' file located in the 'referential' directory.
    """
    from services.backend.project.repository.seeder import mapper, seeder

    print(f"Seed data with this mapping : {mapping_filename}")

    mapping_filename = secure_filename(mapping_filename)

    # le répertoire de travail actuel si __file__ n'est pas disponible
    script_dir = os.path.dirname(os.path.abspath(
        __file__)) if __file__ else os.getcwd()

    # le répertoire des fichiers csv à traiter
    csv_to_seed_dir = os.path.join(script_dir, "referential")

    # mapping_filename = "mapping_1.json"
    mapping_path = os.path.join(csv_to_seed_dir, mapping_filename)
    # Mapping des fichiers CSV aux modèles correspondants avec les mappings de colonnes
    csv_models_mapping = mapper(mapping_path)

    # TODO-BACK le rapport doit sortir ici et non dans la fonction peut être utiliser un logger
    seeded, err = seeder(csv_models_mapping, csv_to_seed_dir)


if __name__ == '__main__':
    cli()
