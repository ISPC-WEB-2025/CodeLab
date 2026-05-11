from django.db import models

class Categoria(models.Model):
    id_cat = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'CATEGORIA'

    def __str__(self):
        return self.nombre

class Proveedor(models.Model):
    id_prov = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'PROVEEDOR'

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    id_art = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    codigo = models.CharField(max_length=50)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    id_cat = models.ForeignKey(Categoria, on_delete=models.PROTECT, db_column='id_cat')

    class Meta:
        managed = False
        db_table = 'PRODUCTO'

    def __str__(self):
        return self.nombre

class ProductoProveedor(models.Model):
    id_enlace = models.AutoField(primary_key=True)
    id_art = models.ForeignKey(Producto, on_delete=models.PROTECT, db_column='id_art')
    id_prov = models.ForeignKey(Proveedor, on_delete=models.PROTECT, db_column='id_prov')

    class Meta:
        managed = False
        db_table = 'PRODUCTO_PROVEEDOR'