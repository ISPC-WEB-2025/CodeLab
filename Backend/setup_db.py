import subprocess
import sys
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django

django.setup()
import MySQLdb

from django.conf import settings
from django.db import connection

db = settings.DATABASES["default"]
conn = MySQLdb.connect(host=db["HOST"], user=db["USER"], passwd=db["PASSWORD"])
cursor = conn.cursor()
cursor.execute(
    f"CREATE DATABASE IF NOT EXISTS {db['NAME']} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
)
conn.commit()
cursor.close()
conn.close()

print("✅ Base de datos creada.")


def run_sql(file):
    print(f"Ejecutando {file}...")
    with open(file, "r", encoding="utf-8") as f:
        sql = f.read()
    with connection.cursor() as cursor:
        for statement in sql.split(";"):
            statement = statement.strip()
            if statement:
                cursor.execute(statement)


print("1. Ejecutando estructura base...")
run_sql("scripts/01_estructura.sql")

print("2. Ejecutando migraciones Django...")
subprocess.run([sys.executable, "manage.py", "migrate"], check=True)

print("3. Creando tabla MOVIMIENTO...")
run_sql("scripts/02_movimiento.sql")

print("4. Insertando datos de prueba...")
run_sql("scripts/03_datos.sql")

print("✅ Base de datos lista.")
