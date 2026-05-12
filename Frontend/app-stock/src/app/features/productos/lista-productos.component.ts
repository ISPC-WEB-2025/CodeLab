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
              private router: Router) {}
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
        this.error = 'Error al cargar los productos. Verificá que el backend esté corriendo.';
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
