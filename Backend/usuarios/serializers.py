from rest_framework import serializers
from .models import Role, Usuario

class RoleSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Role  
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    # Sacamos el RoleSerializer anidado para poder guardar roles fácilmente.
    # Así, Angular solo tiene que mandar el ID del rol (ej: "rol": 1)

    class Meta:
        model = Usuario  # Sin coma
        # Es mejor listar los campos para no exponer datos de seguridad internos
        fields = ['id', 'email', 'nombre', 'dni', 'fecha_nacimiento', 'rol', 'password']
        
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def create(self, validated_data):
        # Extraemos el rol. Al sacar el read_only, ahora sí va a llegar el ID correctamente.
        rol_asignado = validated_data.get('rol', None)

        # Usamos TU manager personalizado para crear el usuario y encriptar la clave
        user = Usuario.objects.create_user(
            email=validated_data['email'],
            nombre=validated_data['nombre'],
            dni=validated_data['dni'],
            fecha_nacimiento=validated_data['fecha_nacimiento'],
            password=validated_data['password'],
            rol=rol_asignado
        )
        return user