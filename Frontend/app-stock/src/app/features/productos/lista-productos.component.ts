import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ModalService } from '../../core/services/modal.service';

import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../core/models/producto.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css',
})
export class ListaProductosComponent implements OnInit {
  productos: Producto[] = [];
  cargando: boolean = true;
  error: string = '';
  terminoBusqueda: string = '';

  private busqueda$ = new Subject<string>();
  constructor(
    private productoService: ProductoService,
    private router: Router,
    private modalService: ModalService
  ) { }

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
        this.productos = [
          {
            id_art: 1,
            nombre: 'Perfil de aluminio 45mm',
            codigo: 'ALU-45',
            precio_venta: 12500.0,
            id_cat: 1,
            descripcion: 'Perfil para guías de cortinas',
          },
          {
            id_art: 2,
            nombre: 'Motor Tubular 50Nm',
            codigo: 'MOT-50',
            precio_venta: 85000.0,
            id_cat: 4,
            descripcion: 'Motor para cortinas de enrollar pesadas',
          },
          {
            id_art: 3,
            nombre: 'Lama de aluminio inyectado',
            codigo: 'LAM-PORT',
            precio_venta: 4500.5,
            id_cat: 3,
            descripcion: 'Lama para portones rodantes',
          },
        ];
        this.error = 'demo';
        this.cargando = false;
      },
    });

    this.busqueda$
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((termino) => this.productoService.buscarProductos(termino)),
      )
      .subscribe({
        next: (data) => {
          this.productos = data;
          this.cargando = false;
          this.error = '';
        },
        error: () => {
          this.error = 'Error al buscar productos.';
          this.cargando = false;
        },
      });
  }

  onBusqueda(): void {
    this.cargando = true;
    this.busqueda$.next(this.terminoBusqueda);
  }

  async eliminar(id: number) {
    if (await this.modalService.confirmar('¿Eliminar este producto? Esta acción no se puede deshacer.')) {
      this.productoService.delete(id).subscribe({
        next: () => {
          this.productos = this.productos.filter((p) => p.id_art !== id);
        },
        error: () => {
          this.modalService.error('Error al eliminar. Verificá que el backend esté corriendo.');
        },
      });
    }
  }
}
