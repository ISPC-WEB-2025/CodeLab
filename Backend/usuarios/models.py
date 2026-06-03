from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


class Role(models.Model):
    nombre = models.CharField(
        max_length=50,
        unique=True,
        help_text="Nombre del rol (ej: Administrador, Empleado).",
    )
    descripcion = models.TextField(blank=True, help_text="Descripción del rol.")

    def __str__(self):
        return f"{self.nombre}, {self.descripcion}"


class UsuarioManager(BaseUserManager):
    def create_user(
        self, email, nombre, dni, fecha_nacimiento, password=None, **extra_fields
    ):
        if not email:
            raise ValueError(
                "El usuario debe tener un correo electrónico obligatoriamente."
            )
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            nombre=nombre,
            dni=dni,
            fecha_nacimiento=fecha_nacimiento,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, email, nombre, dni, fecha_nacimiento, password=None, **extra_fields
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(
            email, nombre, dni, fecha_nacimiento, password, **extra_fields
        )


class Usuario(AbstractBaseUser, PermissionsMixin):
    nombre = models.CharField(max_length=100, help_text="Nombre completo del usuario.")
    email = models.EmailField(
        unique=True, help_text="Email del usuario. Debe ser único"
    )
    dni = models.CharField(
        max_length=20,
        unique=True,
        validators=[RegexValidator(r"^\d{7,8}$")],
        help_text="Número de documento, tiene que ser único y tener entre 7 u 8 dígitos.",
    )
    fecha_nacimiento = models.DateField(help_text="Fecha de nacimiento.")
    rol = models.ForeignKey(
        Role, on_delete=models.CASCADE, related_name="users", null=True, blank=True
    )

    # Campos requeridos por Django Auth
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    # Reemplazamos el username estándar por el email
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nombre", "dni", "fecha_nacimiento"]

    def __str__(self):
        return (
            f"{self.nombre} ({self.email}), Rol: {self.rol}, Activo: {self.is_active}"
        )

    # Lógica de roles
    @property
    def es_admin(self):
        """Devuelve True si el usuario tiene asignado el rol de Administrador o si es superusuario."""
        return self.is_superuser or (
            self.rol is not None and self.rol.nombre.lower() == "administrador"
        )

    @property
    def es_empleado(self):
        """Devuelve True si el usuario tiene asignado el rol de Empleado."""
        return self.rol is not None and self.rol.nombre.lower() == "empleado"
