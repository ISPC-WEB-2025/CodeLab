from django.db import models


class Categoria(models.Model):
    id_cat = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False  # Evita que Django intente crear la tabla (que solo lea, ya las creamos)
        db_table = "CATEGORIA"

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    id_art = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(null=True, blank=True)
    codigo = models.CharField(max_length=50, unique=True)
    precio_venta = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    id_cat = models.ForeignKey(Categoria, on_delete=models.PROTECT, db_column="id_cat")
    # Agregamos db_column='id_cat' para que busque la columna exacta que creaste
    # sin db_column='id_cat', django agrega _id al final del nombre (despues no coincide con la BD)

    class Meta:
        managed = False  # Le dice a Django que no intente modificar ni crear la tabla, que lea las que ya están creadas manualmente
        db_table = "PRODUCTO"

    def __str__(self):
        return self.nombre


class Sucursal(models.Model):
    id_suc = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=300)

    class Meta:
        managed = False
        db_table = "SUCURSAL"

    def __str__(self):
        return self.nombre


class Proveedor(models.Model):
    id_prov = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    cuit = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=30)
    email = models.CharField(max_length=150)
    direccion = models.CharField(max_length=300)

    class Meta:
        managed = False
        db_table = "PROVEEDOR"

    def __str__(self):
        return self.nombre


class StockSucursal(models.Model):
    id_stock = models.AutoField(primary_key=True)
    cantidad_stock = models.IntegerField(default=0)
    stock_min = models.IntegerField(default=0)
    id_art = models.ForeignKey(Producto, on_delete=models.PROTECT, db_column="id_art")
    id_suc = models.ForeignKey(Sucursal, on_delete=models.PROTECT, db_column="id_suc")

    class Meta:
        managed = False
        db_table = "STOCK_SUCURSAL"
