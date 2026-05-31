from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response #Es el traductor. Agarra diccionarios de Python y los convierte en JSON
from rest_framework.authtoken.models import Token #El modelo de Token que viene con Django REST Framework
from rest_framework import status #Nos da códigos de estado HTTP para usar en las respuestas (200, 400, 401, etc)
from django.contrib.auth import authenticate #va a la base de datos, busca el usuario y verifica si la contraseña desencriptada coincide.

class LoginUsuarioView(APIView):
    def post(self, request): #define vista, solo recibe post, no get (ej barra de naveg) / request contiene lo que envía Angular
        # 1. Capturamos los datos que nos va a mandar Angular
        email = request.data.get('email')
        password = request.data.get('password') #DRF abre json, con get extrae y guarda en variables

        # 2. Django verifica si el email y la contraseña coinciden en la base de datos
        user = authenticate(request, email=email, password=password)

        if user is not None:
            # 3. Si todo está bien, buscamos su token (o le creamos uno nuevo si no tenía)
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key, #devuelve token para que Angular lo guarde y lo mande en cada petición
                'email': user.email, 
                'es_admin': user.es_admin,
                'es_empleado': user.es_empleado #booleanos para poder usar *ngIf en el html y mostrar/ocultar cosas según el rol del usuario
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Email o contraseña incorrectos.'
            }, status=status.HTTP_401_UNAUTHORIZED)