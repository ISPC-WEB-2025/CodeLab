from rest_framework import serializers
from .models import Role, Usuario


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


class UsuarioSerializer(serializers.ModelSerializer):
    rol = RoleSerializer(
        read_only=True
    )  # Para mostrar los datos del rol en las respuestas
    rol_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        source="rol",
        write_only=True,
    )

    class Meta:
        model = Usuario  # Sin coma
        # Es mejor listar los campos para no exponer datos de seguridad internos
        fields = [
            "id",
            "email",
            "nombre",
            "dni",
            "fecha_nacimiento",
            "rol",
            "rol_id",
            "password",
        ]

        extra_kwargs = {
            "password": {
                "write_only": True,
                "required": False,
            },  # Hacemos que el password no sea obligatorio para poder editar usuarios sin cambiar su contraseña
        }

    def create(self, validated_data):
        # Extraemos el rol. Al sacar el read_only, ahora sí va a llegar el ID correctamente.
        rol_asignado = validated_data.get("rol", None)

        # Usamos TU manager personalizado para crear el usuario y encriptar la clave
        user = Usuario.objects.create_user(
            email=validated_data["email"],
            nombre=validated_data["nombre"],
            dni=validated_data["dni"],
            fecha_nacimiento=validated_data["fecha_nacimiento"],
            password=validated_data["password"],
            rol=rol_asignado,
        )
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
