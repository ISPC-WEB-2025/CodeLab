from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet,
    CategoriaViewSet,
    SucursalViewSet,
    ProveedorViewSet,
    ProductoProveedorViewSet,
    StockSucursalViewSet,
    MovimientoViewSet,
)


router = DefaultRouter()

router.register(
    r"productos", ProductoViewSet, basename="producto"
)  # basename es opcional pero recomendado para evitar conflictos de nombres en rutas con múltiples ViewSets
router.register(r"categorias", CategoriaViewSet)
router.register(r"sucursales", SucursalViewSet)
router.register(r"proveedores", ProveedorViewSet)
router.register(r"producto-proveedor", ProductoProveedorViewSet, basename="producto-proveedor")
router.register(r"stock", StockSucursalViewSet, basename="stock")
router.register(r"movimientos", MovimientoViewSet, basename="movimiento")

urlpatterns = [
    path("", include(router.urls)),
]
