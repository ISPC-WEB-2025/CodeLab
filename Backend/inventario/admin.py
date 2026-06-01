from django.contrib import admin
from .models import Producto
from .models import Movimiento


admin.site.register(Producto)
admin.site.register(Movimiento)  
