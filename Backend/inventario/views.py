# Backend/inventario/views.py
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from .models import Producto, Categoria, Sucursal, Proveedor, StockSucursal, Movimiento
from django.db import transaction
from .serializers import (
    ProductoSerializer,
    CategoriaSerializer,
    SucursalSerializer,
    ProveedorSerializer,
    StockSucursalSerializer,
    MovimientoSerializer,
)


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["nombre", "codigo"]


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all()
    serializer_class = SucursalSerializer


class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer


class StockSucursalViewSet(viewsets.ModelViewSet):
    queryset = StockSucursal.objects.select_related("id_art", "id_suc").all()
    serializer_class = StockSucursalSerializer

    # REMOVIDO: update()
    # Justificación: Redundante. El método update() nativo de ModelViewSet ya procesa
    # internamente la actualización y retorna un estado HTTP 200 OK por defecto.
    # Forzar el status_code manualmente no altera ni aporta comportamiento extra.

    # REMOVIDO: destroy()
    # Justificación: Código muerto (Dead Code). Invocar a super().destroy() sin añadir
    # lógica de validación previa o posterior al borrado duplica el comportamiento
    # heredado de la clase padre sin ningún propósito técnico


class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = Movimiento.objects.select_related("id_art", "id_suc", "id_prov").all()
    serializer_class = MovimientoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tipo = serializer.validated_data["tipo"]
        cantidad = serializer.validated_data["cantidad"]
        producto = serializer.validated_data["id_art"]
        sucursal = serializer.validated_data["id_suc"]

        # TK44: verificar que existe registro de stock para ese producto+sucursal
        try:
            stock_obj = StockSucursal.objects.get(id_art=producto, id_suc=sucursal)
        except StockSucursal.DoesNotExist:
            return Response(
                {
                    "error": "No existe registro de stock para ese producto en esa sucursal."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # TK44: validar stock suficiente si es Salida
        if tipo == "Salida" and stock_obj.cantidad_stock < cantidad:
            return Response(
                {
                    "error": "Stock insuficiente.",
                    "stock_disponible": stock_obj.cantidad_stock,
                    "cantidad_solicitada": cantidad,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        """ # # TK43: aplicar el movimiento y actualizar stock en una transacción atómica
        Con atomic(), si cualquiera de las dos operaciones lanza una excepción, Django hace un rollback 
        automático y ninguna de las dos se persiste en la base de datos. Las dos se guardan juntas o ninguna. 
        Es especialmente importante en operaciones financieras/de inventario como la tuya, donde stock y movimiento 
        tienen que estar siempre sincronizados."""

        with transaction.atomic():
            # Guardar stock antes del movimiento
            serializer.validated_data["stock_previo"] = stock_obj.cantidad_stock

            if tipo == "Entrada":
                stock_obj.cantidad_stock += cantidad
            elif tipo == "Salida":
                stock_obj.cantidad_stock -= cantidad
            # Traslado no modifica stock_sucursal (requeriría origen y destino)

            stock_obj.save()
            self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
