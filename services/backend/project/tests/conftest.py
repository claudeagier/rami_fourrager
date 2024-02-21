# services/users/project/tests/conftest.py
import pytest

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy import event

from project import create_app, db
from project.repository.users.models import User


def get_table_order(metadata):
    """Retourne l'ordre des tables pour l'insertion en respectant les contraintes de clé étrangère."""
    table_order = []

    def dfs(table_name):
        if table_name not in table_order:
            table = metadata.tables[table_name]
            for foreign_key in table.foreign_keys:
                parent_table_name = foreign_key.column.table.name
                if parent_table_name != table_name:
                    dfs(parent_table_name)
            table_order.append(table_name)

    for table in metadata.sorted_tables:
        dfs(table.name)

    return table_order


def copy_dev_to_test(test_app):
    # Créer un moteur SQLAlchemy pour chaque base de données
    engine_dev = create_engine(test_app.config['SQLALCHEMY_DATABASE_DEV_URI'])
    engine_test = create_engine(test_app.config['SQLALCHEMY_DATABASE_URI'])

    # Créer des sessions SQLAlchemy pour chaque moteur
    SessionDev = sessionmaker(bind=engine_dev)
    SessionTest = sessionmaker(bind=engine_test)

    # Créer des sessions pour chaque base de données
    session_dev = SessionDev()
    session_test = SessionTest()

    @event.listens_for(engine_test, "before_cursor_execute")
    def before_cursor_execute(conn, cursor, statement, params, context, executemany):
        if "INSERT" in statement:
            cursor.execute("SET session_replication_role = 'replica'")

    @event.listens_for(engine_test, "after_cursor_execute")
    def after_cursor_execute(conn, cursor, statement, params, context, executemany):
        if "INSERT" in statement:
            cursor.execute("SET session_replication_role = 'origin'")

    # Récupérer les métadonnées et les relations de clé étrangère
    metadata = db.metadata

    # Obtenir l'ordre des tables pour l'insertion
    table_order = get_table_order(metadata)
    # Copier les données table par table
    for table_name in table_order:
        if table_name != 'users' and table_name != 'authorizations':
            try:
                with engine_dev.connect() as source_conn, engine_test.connect() as dest_conn:
                    # Commencer une transaction
                    dest_conn.execute("BEGIN")

                    # Insérer les données dans la table de destination
                    source_result = source_conn.execute(
                        f"SELECT * FROM {table_name} LIMIT 10")
                    for row in source_result:
                        values = {col: row[col] for col in row.keys()}
                        dest_conn.execute(
                            metadata.tables[table_name].insert().values(values))

                    # Valider la transaction
                    dest_conn.execute("COMMIT")

            except IntegrityError as e:
                # Si une contrainte d'intégrité est violée, annuler la transaction et passer à la prochaine table
                dest_conn.execute("ROLLBACK")
                print(
                    f"IntegrityError occurred while copying data for table {table_name}: {str(e)}")
                continue


@pytest.fixture(scope="module")
def test_app():
    app = create_app()
    app.config.from_object("project.config.testing")
    with app.app_context():
        yield app  # testing happens here


@pytest.fixture(scope="module")
def test_database(test_app):
    db.create_all()

    copy_dev_to_test(test_app)

    yield db  # testing happens here
    db.session.remove()
    db.drop_all()


@pytest.fixture(scope="module")
def add_user():
    def _add_user(username, email, password):
        user = User(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()
        return user

    return _add_user


@pytest.fixture(scope="module")
def client(test_app):
    """Create a test client for the Flask application."""
    return test_app.test_client()
