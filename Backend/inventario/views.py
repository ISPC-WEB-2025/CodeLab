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
    queryset = StockSucursal.objects.select_related('id_art', 'id_suc').all()
    serializer_class = StockSucursalSerializer

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.status_code = status.HTTP_200_OK
        return response

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)