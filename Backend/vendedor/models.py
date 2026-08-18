from django.db import models
from inventario.models import Categoria, Producto, Proveedor


class ProductoProveedor(models.Model):
    id_enlace = models.AutoField(primary_key=True)
    id_art = models.ForeignKey(Producto, on_delete=models.PROTECT, db_column="id_art")
    id_prov = models.ForeignKey(
        Proveedor, on_delete=models.PROTECT, db_column="id_prov"
    )
    precio_costo = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = "PRODUCTO_PROVEEDOR"
