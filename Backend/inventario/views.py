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
        sucursal_destino = serializer.validated_data.get("id_suc_destino")

        # Asignar usuario autenticado si no fue provisto
        if request.user and request.user.is_authenticated and not serializer.validated_data.get("id_usuario"):
            serializer.validated_data["id_usuario"] = request.user

        # Validar permisos para Entradas
        if tipo == "Entrada":
            es_admin = getattr(request.user, "es_admin", False) or getattr(request.user, "is_superuser", False)
            if request.user.is_authenticated and not es_admin:
                return Response(
                    {"error": "Los vendedores no pueden registrar entradas de stock."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        # Validaciones para Traslados
        if tipo == "Traslado":
            if not sucursal_destino:
                return Response(
                    {"error": "Debe especificar la sucursal de destino para el traslado."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if sucursal_destino.pk == sucursal.pk:
                return Response(
                    {"error": "La sucursal de origen y destino no pueden ser la misma."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        with transaction.atomic():
            if tipo == "Entrada":
                stock_obj, _ = StockSucursal.objects.select_for_update().get_or_create(
                    id_art=producto,
                    id_suc=sucursal,
                    defaults={"cantidad_stock": 0, "stock_min": producto.stock_min_global},
                )
                serializer.validated_data["stock_previo"] = stock_obj.cantidad_stock
                stock_obj.cantidad_stock += cantidad
                stock_obj.save()

            elif tipo == "Salida":
                stock_obj = (
                    StockSucursal.objects.select_for_update()
                    .filter(id_art=producto, id_suc=sucursal)
                    .first()
                )
                if not stock_obj:
                    return Response(
                        {"error": "No existe registro de stock para ese producto en esa sucursal."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if stock_obj.cantidad_stock < cantidad:
                    return Response(
                        {
                            "error": "Stock insuficiente.",
                            "stock_disponible": stock_obj.cantidad_stock,
                            "cantidad_solicitada": cantidad,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                serializer.validated_data["stock_previo"] = stock_obj.cantidad_stock
                stock_obj.cantidad_stock -= cantidad
                stock_obj.save()

            elif tipo == "Traslado":
                stock_origen = (
                    StockSucursal.objects.select_for_update()
                    .filter(id_art=producto, id_suc=sucursal)
                    .first()
                )
                if not stock_origen:
                    return Response(
                        {"error": "No existe registro de stock en la sucursal de origen."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if stock_origen.cantidad_stock < cantidad:
                    return Response(
                        {
                            "error": "Stock insuficiente en la sucursal de origen.",
                            "stock_disponible": stock_origen.cantidad_stock,
                            "cantidad_solicitada": cantidad,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                stock_destino, _ = StockSucursal.objects.select_for_update().get_or_create(
                    id_art=producto,
                    id_suc=sucursal_destino,
                    defaults={"cantidad_stock": 0, "stock_min": producto.stock_min_global},
                )

                serializer.validated_data["stock_previo"] = stock_origen.cantidad_stock
                stock_origen.cantidad_stock -= cantidad
                stock_destino.cantidad_stock += cantidad

                stock_origen.save()
                stock_destino.save()

                if not serializer.validated_data.get("motivo"):
                    serializer.validated_data["motivo"] = f"Traslado hacia {sucursal_destino.nombre}"

            self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
