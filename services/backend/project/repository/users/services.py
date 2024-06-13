# services/users/project/api/services.py


from project import db
from project.repository.users.models import User, Authorization
from sqlalchemy.orm import joinedload


def get_all_users():
    return User.query.all()


def get_user_by_id(user_id):
    t = User.query.filter_by(id=user_id).first()
    return t


def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def add_user(username, email, password, authorization):
    # auth = get_authorization_by_name(authorization)
    user = User(username=username, email=email,
                password=password, authorization=authorization)
    db.session.add(user)
    db.session.commit()
    return user


def update_user(user, username, email, authorization):
    user.username = username
    user.email = email
    user.authorization = authorization

    db.session.commit()
    return user


def delete_user(user):
    db.session.delete(user)
    db.session.commit()
    return user


def get_Authorizations():
    return Authorization.query.all()


def get_authorization_by_name(name):
    return Authorization.query.filter_by(name=name).first()


def get_authorization_by_id(id):
    return Authorization.query.get(id)
