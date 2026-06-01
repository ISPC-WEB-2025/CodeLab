from rest_framework import serializers
from .models import Usuario, Role

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'nombre']

class UsuarioSerializer(serializers.ModelSerializer):
    rol = RoleSerializer(read_only=True)
    rol_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        source='rol',
        write_only=True
    )
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'email', 'dni', 'fecha_nacimiento', 'rol', 'rol_id', 'is_active', 'password']
        extra_kwargs = {
            'password': {'write_only':True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance