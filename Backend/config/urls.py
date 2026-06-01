from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from inventario.views import ProductoViewSet

router = DefaultRouter()
router.register(r"productos", ProductoViewSet)
# config/urls.py
urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("inventario.urls")),
    path("api/vendedor/", include("vendedor.urls")),
    path("api/usuarios/", include("usuarios.urls")),
]
