from rest_framework import serializers
from .models import Producto, Categoria, Sucursal, Proveedor, StockSucursal, Movimiento
from django.utils import timezone
from django.db.models import Sum


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


class ProductoSerializer(serializers.ModelSerializer):

    categoria = CategoriaSerializer(source="id_cat", read_only=True)
    nombre = serializers.CharField(allow_blank=True)
    codigo = serializers.CharField(allow_blank=True)
    stock_total = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = [
            "id_art",
            "nombre",
            "descripcion",
            "codigo",
            "precio_venta",
            "stock_min_global",
            "stock_total",
            "id_cat",
            "categoria",
        ]

    def get_stock_total(self, obj):
        total = StockSucursal.objects.filter(id_art=obj).aggregate(
            total=Sum("cantidad_stock")
        )["total"]
        return total or 0

    def validate_nombre(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El nombre del producto es obligatorio.")
        return value.strip()

    def validate_codigo(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El código del producto es obligatorio.")

        qs = Producto.objects.filter(codigo=value.strip())
        # En edición excluimos el producto actual para no chocar consigo mismo
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                f"Ya existe un producto con el código '{value}'."
            )

        return value.strip()


class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = "__all__"


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = "__all__"

    def validate_cuit(self, value):
        cuit_limpio = value.strip()
        qs = Proveedor.objects.filter(cuit__iexact=cuit_limpio)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                f"Ya existe un proveedor registrado con el CUIT '{cuit_limpio}'."
            )
        return cuit_limpio


class StockSucursalSerializer(serializers.ModelSerializer):
    nombre_producto = serializers.CharField(source="id_art.nombre", read_only=True)
    nombre_sucursal = serializers.CharField(source="id_suc.nombre", read_only=True)

    class Meta:
        model = StockSucursal
        fields = [
            "id_stock",
            "cantidad_stock",
            "stock_min",
            "id_art",
            "id_suc",
            "nombre_producto",
            "nombre_sucursal",
        ]


class MovimientoSerializer(serializers.ModelSerializer):
    nombre_producto = serializers.CharField(source="id_art.nombre", read_only=True)
    nombre_sucursal = serializers.CharField(source="id_suc.nombre", read_only=True)
    nombre_proveedor = serializers.CharField(
        source="id_prov.nombre", read_only=True, default=None
    )
    cuit_proveedor = serializers.CharField(
        source="id_prov.cuit", read_only=True, default=None
    )
    id_suc_destino = serializers.PrimaryKeyRelatedField(
        queryset=Sucursal.objects.all(),
        required=False,
        allow_null=True,
        write_only=True,
    )

    class Meta:
        model = Movimiento
        fields = "__all__"
        extra_kwargs = {
            "fecha_hora": {"required": False, "allow_null": True},
            "id_usuario": {"required": False, "allow_null": True},
            "id_prov": {"required": False, "allow_null": True},
            "id_mov": {"required": False},
        }

    def create(self, validated_data):
        validated_data.pop("id_suc_destino", None)
        if not validated_data.get("fecha_hora"):
            validated_data["fecha_hora"] = timezone.now()
        return super().create(validated_data)

