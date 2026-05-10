from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet,
    CategoriaViewSet,
    SucursalViewSet,
    ProveedorViewSet,
    StockSucursalViewSet,
)

# El Router genera las URLs automáticamente (api/productos/, api/productos/1/, etc.)
router = DefaultRouter()
# Ejemplos de endpoints generados por el router:
# GET api/productos/          → lista todos los productos
# GET api/productos/{id}/     → detalle de un producto
router.register(r"productos", ProductoViewSet)
router.register(r"categorias", CategoriaViewSet)
router.register(r"sucursales", SucursalViewSet)
router.register(r"proveedores", ProveedorViewSet)
# GET api/stock/              → lista todo el stock con nombre de producto y sucursal
# GET api/stock/{id}/         → detalle de un registro de stock
router.register(r"stock", StockSucursalViewSet, basename="stock")

urlpatterns = [
    path("", include(router.urls)),
]
