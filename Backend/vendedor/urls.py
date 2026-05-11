from django.urls import path
from .views import VendedorProductoView

urlpatterns = [
    path('productos/', ProductoVendedorView.as_view(), name='vendedor-productos'),
]