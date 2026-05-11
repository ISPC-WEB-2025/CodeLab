from django.urls import path
from .views import VendedorProductoView

urlpatterns = [
    path('productos/', VendedorProductoView.as_view()),
]