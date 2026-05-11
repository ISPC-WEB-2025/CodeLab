from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Producto
from .serializers import VendedorProductoSerializer

class VendedorProductoView(APIView):
    def get(self, request):
        productos = Producto.objects.all()
        serializer = VendedorProductoSerializer(productos, many=True)
        return Response(serializer.data)