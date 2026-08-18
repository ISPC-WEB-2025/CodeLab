import os
import sys
from pathlib import Path

# Configurar entorno de Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
django.setup()

from usuarios.models import Usuario, Role


def crear_superadmin():
    rol_admin, _ = Role.objects.get_or_create(
        nombre="ADMINISTRADOR",
        defaults={"descripcion": "Rol con control total del sistema"},
    )

    email = "admin@codelab.com"
    password = "AdminPassword123!"
    dni = "12345678"
    nombre = "Super Admin"

    user, created = Usuario.objects.get_or_create(
        email=email,
        defaults={
            "nombre": nombre,
            "dni": dni,
            "fecha_nacimiento": "1990-01-01",
            "rol": rol_admin,
            "is_active": True,
            "is_staff": True,
            "is_superuser": True,
        },
    )

    user.nombre = nombre
    user.dni = dni
    user.rol = rol_admin
    user.is_active = True
    user.is_staff = True
    user.is_superuser = True
    user.set_password(password)
    user.save()

    print("\n==========================================")
    print("  USUARIO SUPERADMIN LISTO PARA USAR")
    print("==========================================")
    print(f"  Email:      {email}")
    print(f"  Password:   {password}")
    print(f"  Rol:        {rol_admin.nombre}")
    print("==========================================\n")


if __name__ == "__main__":
    crear_superadmin()
