from rest_framework.views import exception_handler
from rest_framework.response import Response    
from rest_framework import status  

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
       if response.status_code == 404:
           response.data = {'error': 'El recurso solicitado no existe.'}
       elif response.status_code == 400:
           response.data = {'error': 'Datos inválidos', 'detalle': response.data}
       elif response.status_code == 204:
           pass # No se devuelve contenido para 204, no hay mensaje

    return response