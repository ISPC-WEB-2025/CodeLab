from rest_framework import serializers
from .models import Role, Usuario

class RoleSerializer(serializers.ModelSerializer):

    class Meta: 
        model = Role,
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):

    roles = RoleSerializer(read_only=True)

    class Meta:
        model = Usuario,
        fields = '__all__'
