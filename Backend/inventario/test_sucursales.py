# Backend/inventario/test_sucursales.py
import os
from pathlib import Path
from django.test import TestCase
from django.db import connection
from rest_framework.test import APIClient
from rest_framework import status
from .models import Sucursal, Categoria, Producto, StockSucursal, Movimiento


class SucursalTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        backend_dir = Path(__file__).resolve().parent.parent
        estructura_sql = backend_dir / "scripts" / "01_estructura.sql"
        movimiento_sql = backend_dir / "scripts" / "02_movimiento.sql"

        with connection.cursor() as cursor:
            if estructura_sql.exists():
                with open(estructura_sql, "r", encoding="utf-8") as f:
                    for stmt in f.read().split(";"):
                        stmt = stmt.strip()
                        if stmt and not stmt.upper().startswith("DROP TABLE"):
                            cursor.execute(stmt)
            if movimiento_sql.exists():
                with open(movimiento_sql, "r", encoding="utf-8") as f:
                    for stmt in f.read().split(";"):
                        stmt = stmt.strip()
                        if stmt and not stmt.upper().startswith("DROP TABLE"):
                            cursor.execute(stmt)

    def setUp(self):
        self.client = APIClient()
        self.categoria = Categoria.objects.create(nombre="Herramientas")
        self.producto = Producto.objects.create(
            nombre="Taladro Percutor",
            codigo="TAL-001",
            precio_venta=45000,
            id_cat=self.categoria,
        )

    def test_creacion_sucursal_y_auto_inicializacion(self):
        """Al crear una nueva sucursal, debe auto-inicializar StockSucursal en 0 para los productos existentes."""
        response = self.client.post(
            "/api/inventario/sucursales/",
            {"nombre": "Sede Centro", "direccion": "Av. Colón 1234"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        suc_id = response.data["id_suc"]

        # Verificar que se creó StockSucursal
        stock = StockSucursal.objects.filter(id_suc_id=suc_id, id_art=self.producto)
        self.assertTrue(stock.exists())
        self.assertEqual(stock.first().cantidad_stock, 0)
        self.assertEqual(stock.first().stock_min, 0)

    def test_metricas_sucursal_en_serializer(self):
        """Verificar el cálculo de total_articulos, total_stock y articulos_alerta."""
        suc = Sucursal.objects.create(nombre="Sede Norte", direccion="Ruta 9 Km 10")
        stock = StockSucursal.objects.get(id_suc=suc, id_art=self.producto)
        stock.cantidad_stock = 5
        stock.stock_min = 10  # En alerta (5 <= 10)
        stock.save()

        response = self.client.get(f"/api/inventario/sucursales/{suc.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_articulos"], 1)
        self.assertEqual(response.data["total_stock"], 5)
        self.assertEqual(response.data["articulos_alerta"], 1)

    def test_bloqueo_eliminacion_con_stock_activo(self):
        """No debe permitir eliminar una sucursal si tiene existencias físicas > 0."""
        suc = Sucursal.objects.create(nombre="Sede Sur", direccion="Av. Vélez Sársfield 500")
        stock = StockSucursal.objects.get(id_suc=suc, id_art=self.producto)
        stock.cantidad_stock = 15
        stock.save()

        response = self.client.delete(f"/api/inventario/sucursales/{suc.pk}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("posee artículos con existencias de stock activas", response.data["error"])
        self.assertTrue(Sucursal.objects.filter(pk=suc.pk).exists())

    def test_bloqueo_eliminacion_con_movimientos(self):
        """No debe permitir eliminar una sucursal si tiene historial de movimientos."""
        suc = Sucursal.objects.create(nombre="Sede Este", direccion="Av. Sabattini 800")
        from django.utils import timezone
        Movimiento.objects.create(
            tipo="Entrada",
            cantidad=10,
            fecha_hora=timezone.now(),
            motivo="Compra inicial",
            id_art=self.producto,
            id_suc=suc,
        )

        response = self.client.delete(f"/api/inventario/sucursales/{suc.pk}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("cuenta con movimientos de inventario históricos", response.data["error"])

    def test_eliminacion_exitosa_sucursal_vacia(self):
        """Debe permitir eliminar una sucursal sin existencias activas ni movimientos."""
        suc = Sucursal.objects.create(nombre="Sede Temporal", direccion="Calle Falsa 123")
        response = self.client.delete(f"/api/inventario/sucursales/{suc.pk}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Sucursal.objects.filter(pk=suc.pk).exists())
        self.assertFalse(StockSucursal.objects.filter(id_suc_id=suc.pk).exists())

    def test_accion_inventario_por_sucursal(self):
        """El endpoint /sucursales/{id}/inventario/ debe listar los stocks de esa sede."""
        suc = Sucursal.objects.create(nombre="Sede Oeste", direccion="Av. Fuerza Aérea 2000")
        response = self.client.get(f"/api/inventario/sucursales/{suc.pk}/inventario/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["nombre_producto"], "Taladro Percutor")
