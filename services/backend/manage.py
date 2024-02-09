# services/users/manage.py
import os

from flask.cli import FlaskGroup

from project import create_app, db
from project.repository.users.models import User, Role

from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database

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


@cli.command('seed')
def seed_db():
    """Seed defulat data to the database."""
    roles = [
            Role(
            name='user',
            description="user role"
        ),
            Role(
            name='admin',
            description="admin role"
        )
    ]
    db.session.add_all(roles)
    db.session.commit()
    
@cli.command('add_admin_user')
def add_admin_user():
    """seed admin user in database
    """
    #TODO-BACK mettre l'admin user ailleurs 
    admin_role = db.session.query(Role).filter(Role.name == 'admin').first() 
    db.session.add(User(
        username='totoescargot',
        email='toto.escargot@jardin.com',
        password='mangesalade',
        role=admin_role
    ))
    db.session.commit()

@cli.command('seed_data')    
def seed_data():
    """seed all data you need
    """
    from project.repository.referentials.data_seeder import mapper, seeder
    
    # le répertoire de travail actuel si __file__ n'est pas disponible
    script_dir = os.path.dirname(os.path.abspath(__file__)) if __file__ else os.getcwd()
    
    # le répertoire des fichiers csv à traiter
    csv_to_seed_dir = os.path.join(script_dir, "referential")
    
    mapping_filename = "mapping_1.json"
    mapping_path = os.path.join(csv_to_seed_dir, mapping_filename)
    # Mapping des fichiers CSV aux modèles correspondants avec les mappings de colonnes
    csv_models_mapping = mapper(mapping_path)
    
    #TODO-BACK le rapport doit sortir ici et non dans la fonction peut être utiliser un logger
    seeded,err = seeder(csv_models_mapping, csv_to_seed_dir)


if __name__ == '__main__':
    cli()
