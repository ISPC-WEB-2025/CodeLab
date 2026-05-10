from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Producto, Categoria, Sucursal, Proveedor, StockSucursal
from .serializers import (
    ProductoSerializer,
    CategoriaSerializer,
    SucursalSerializer,
    ProveedorSerializer,
    StockSucursalSerializer,
)


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


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
    queryset = StockSucursal.objects.select_related(
        "id_art", "id_suc"
    ).all()  # Optimización para evitar consultas adicionales
    serializer_class = StockSucursalSerializer
