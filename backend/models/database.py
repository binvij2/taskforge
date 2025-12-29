import os
from urllib.parse import quote_plus
import pymysql
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

MYSQL_HOST = os.getenv("MYSQL_HOST", "mysql-shared")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
APP_ID = os.getenv("APP_ID", "")

APP_NAME = "devtaskboard"
MYSQL_DB = f"{APP_NAME}_{APP_ID[:8]}" if APP_ID else os.getenv("MYSQL_DB", "devtaskboard_db")

def ensure_database_exists():
    try:
        conn = pymysql.connect(
            host=MYSQL_HOST,
            port=int(MYSQL_PORT),
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
        )
        with conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DB}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        conn.close()
    except Exception as e:
        print(f"Warning: Could not create database: {e}")

ensure_database_exists()

DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{quote_plus(MYSQL_PASSWORD)}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()