# services/aktiver/project/config.py
import os


class BaseConfig:
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get("SECRET_KEY")
    BCRYPT_LOG_ROUNDS = 13
    ACCESS_TOKEN_EXPIRATION = 900  # 15 minutes
    REFRESH_TOKEN_EXPIRATION = 2592000  # 30 days
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER")


class development(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    BCRYPT_LOG_ROUNDS = 4


class testing(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_TEST_URL")
    SQLALCHEMY_DATABASE_DEV_URI = os.environ.get("DATABASE_URL")
    BCRYPT_LOG_ROUNDS = 4
    ACCESS_TOKEN_EXPIRATION = 3
    REFRESH_TOKEN_EXPIRATION = 3


class production(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
