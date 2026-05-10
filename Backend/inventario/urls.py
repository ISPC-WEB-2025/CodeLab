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
router.register(r"stock-sucursales", StockSucursalViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
