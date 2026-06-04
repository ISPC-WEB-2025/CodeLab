from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginUsuarioView, RegistroUsuarioView, UserViewSet

# 1. Creamos el router y registramos la ventanilla automática del CRUD (TK59)
router = DefaultRouter()
router.register(r'', UserViewSet, basename='usuario')

urlpatterns = [
    # 2. La ruta de login
    path('login/', LoginUsuarioView.as_view(), name='api_login'),    
    # 3. La ruta de registro
    path('registro/', RegistroUsuarioView.as_view(), name='api_registro'),
    # 4. Agregamos las rutas de lectura, creación, edición y borrado de usuarios
    path('', include(router.urls)),
]