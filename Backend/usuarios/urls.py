from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginUsuarioView, UsuarioViewSet

router = DefaultRouter()
router.register(r'', UsuarioViewSet, basename='usuario')

urlpatterns = [
    path('login/', LoginUsuarioView.as_view(), name='api_login'),
    path('', include(router.urls)),
]