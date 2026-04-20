from django.db import models
from django.core.validators import RegexValidator

class Role(models.Model):
    nombre = models.CharField(
        max_length=50,
        unique=True,
        help_text="Nombre del rol, debe ser único."
    )
    descripcion = models.TextField(
        blank=True,
        help_text="Descripción del rol, debe ser único."
    )
    def __str__(self):
        return f"{self.nombre}, {self.descripcion}"


class Usuario(models.Model):
    nombre = models.CharField(
        max_length=100,
        help_text="Nombre completo del usuario."
    )
    email = models.EmailField(
        unique=True,
        help_text="Email del usuario. Debe ser único"
    )
    dni = models.CharField(
        max_length=20,
        unique=True,
        validators=[RegexValidator(r'^\d{7,8}$')],
        help_text="Número de documento, tiene que ser único y tener entre 7 u 8 dígitos."
    )
    fecha_nacimiento = models.DateField(
        help_text="Fecha de nacimiento."
    )
    rol = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="users")
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre}, Rol: {self.rol}, Activo: {self.activo}"