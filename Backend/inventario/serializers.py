from rest_framework import serializers
from .models import Producto, Categoria, Sucursal, Proveedor, StockSucursal


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = "__all__"


class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = "__all__"


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = "__all__"


class StockSucursalSerializer(serializers.ModelSerializer):
    nombre_producto = serializers.CharField(source="id_art.nombre", read_only=True)
    nombre_sucursal = serializers.CharField(source="id_suc.nombre", read_only=True)

    class Meta:
        model = StockSucursal
        fields = "__all__"
