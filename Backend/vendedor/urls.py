from django.urls import path
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .views import ProductoVendedorView

@api_view(['GET'])
def vendedor_root(request):
    return Response({
        'productos': request.build_absolute_uri('productos/'),
    })

urlpatterns = [
    path('', vendedor_root, name='vendedor-root'),
    path('productos/', ProductoVendedorView.as_view(), name='vendedor-productos'),
]