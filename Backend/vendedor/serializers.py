from rest_framework import serializers
from .models import Producto, Categoria, Proveedor, ProductoProveedor

class VendedorProductoSerializer(serializers.ModelSerializer):
    categoria = serializers.CharField(source='id_cat.nombre', read_only=True)
    proveedor = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = ['id_art', 'nombre', 'codigo', 'precio_venta', 'categoria', 'proveedor']

    def get_proveedor(self, obj):
        enlace = ProductoProveedor.objects.filter(id_art=obj).first()
        if enlace:
            return enlace.id_prov.nombre
        return None