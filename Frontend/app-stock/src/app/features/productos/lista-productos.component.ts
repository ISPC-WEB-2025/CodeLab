import { Component, OnInit } from '@angular/core';

import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../core/models/producto.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lista-productos',
  imports: [],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export class ListaProductosComponent implements OnInit {

  productos: Producto[] = [];
  cargando: boolean = true;
  error: string = '';

  constructor(private productoService: ProductoService,
    private router: Router) { }
  irAltaProducto() {
    this.router.navigate(['/dashboard/productos/nuevo']);
  }

  ngOnInit() {
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: () => {
        // Fallback: datos de prueba cuando el backend no está disponible
        this.productos = [
          { id_art: 1, nombre: 'Perfil de aluminio 45mm', codigo: 'ALU-45', precio_venta: 12500.00, id_cat: 1, descripcion: 'Perfil para guías de cortinas' },
          { id_art: 2, nombre: 'Motor Tubular 50Nm', codigo: 'MOT-50', precio_venta: 85000.00, id_cat: 4, descripcion: 'Motor para cortinas de enrollar pesadas' },
          { id_art: 3, nombre: 'Lama de aluminio inyectado', codigo: 'LAM-PORT', precio_venta: 4500.50, id_cat: 3, descripcion: 'Lama para portones rodantes' }
        ];
        this.error = 'demo';
        this.cargando = false;
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro que querés eliminar este producto?')) {
      this.productoService.delete(id).subscribe({
        next: () => {
          this.productos = this.productos.filter(p => p.id_art !== id);
        },
        error: () => {
          alert('Error al eliminar. Verificá que el backend esté corriendo.');
        }
      });
    }
  }
}
