from django.urls import path
from .views import ProductoVendedorView

urlpatterns = [
    path('productos/', ProductoVendedorView.as_view(), name='vendedor-productos'),
]