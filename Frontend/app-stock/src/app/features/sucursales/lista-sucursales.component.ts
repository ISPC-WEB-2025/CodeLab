import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { SucursalService } from '../../core/services/sucursal.service';
import { ModalService } from '../../core/services/modal.service';
import { Sucursal } from '../../core/models/sucursal.model';
import { StockSucursal } from '../../core/models/stock-sucursal.model';

@Component({
  selector: 'app-lista-sucursales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-sucursales.component.html',
  styleUrl: './lista-sucursales.component.css',
})
export class ListaSucursalesComponent implements OnInit {
  sucursales: Sucursal[] = [];
  cargando: boolean = true;
  error: string = '';
  terminoBusqueda: string = '';
  idEliminar: number | null = null;
  nombreEliminar: string = '';

  // Sucursal seleccionada para inspección rápida de inventario
  sucursalSeleccionada: Sucursal | null = null;
  inventarioSucursal: StockSucursal[] = [];
  cargandoInventario: boolean = false;
  busquedaInventario: string = '';
  soloConStock: boolean = false;

  private busqueda$ = new Subject<string>();

  constructor(
    private sucursalService: SucursalService,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.cargarSucursales();

    this.busqueda$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((termino) => {
          this.cargando = true;
          return this.sucursalService.getAll(termino);
        })
      )
      .subscribe({
        next: (data) => {
          this.sucursales = data;
          this.cargando = false;
          this.error = '';
          // Si la sucursal seleccionada ya no existe en el filtro, mantenerla o resetear
          if (this.sucursalSeleccionada) {
            const match = data.find((s) => s.id_suc === this.sucursalSeleccionada?.id_suc);
            if (match) this.sucursalSeleccionada = match;
          }
        },
        error: () => {
          this.error = 'Ocurrió un error al buscar sucursales.';
          this.cargando = false;
        },
      });
  }

  cargarSucursales(): void {
    this.cargando = true;
    this.error = '';
    this.sucursalService.getAll().subscribe({
      next: (data) => {
        this.sucursales = data;
        this.cargando = false;
        if (data.length > 0 && !this.sucursalSeleccionada) {
          this.seleccionarSucursal(data[0]);
        }
      },
      error: () => {
        this.error = 'No se pudieron cargar las sucursales. Verificá que el backend esté en ejecución.';
        this.cargando = false;
      },
    });
  }

  onBusqueda(): void {
    this.busqueda$.next(this.terminoBusqueda);
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.onBusqueda();
  }

  seleccionarSucursal(sucursal: Sucursal): void {
    this.sucursalSeleccionada = sucursal;
    this.cargarInventarioSede();
  }

  cargarInventarioSede(): void {
    if (!this.sucursalSeleccionada) return;
    this.cargandoInventario = true;
    this.sucursalService
      .getInventario(this.sucursalSeleccionada.id_suc, this.busquedaInventario, this.soloConStock)
      .subscribe({
        next: (stock) => {
          this.inventarioSucursal = stock;
          this.cargandoInventario = false;
        },
        error: () => {
          this.inventarioSucursal = [];
          this.cargandoInventario = false;
        },
      });
  }

  onBusquedaInventario(): void {
    this.cargarInventarioSede();
  }

  onToggleSoloConStock(): void {
    this.cargarInventarioSede();
  }

  limpiarBusquedaInventario(): void {
    this.busquedaInventario = '';
    this.cargarInventarioSede();
  }

  prepararEliminacion(sucursal: Sucursal): void {
    this.idEliminar = sucursal.id_suc;
    this.nombreEliminar = sucursal.nombre;
  }

  confirmarEliminacion(): void {
    if (this.idEliminar === null) return;

    const id = this.idEliminar;
    this.sucursalService.delete(id).subscribe({
      next: () => {
        this.sucursales = this.sucursales.filter((s) => s.id_suc !== id);
        if (this.sucursalSeleccionada?.id_suc === id) {
          this.sucursalSeleccionada = this.sucursales.length > 0 ? this.sucursales[0] : null;
          if (this.sucursalSeleccionada) {
            this.seleccionarSucursal(this.sucursalSeleccionada);
          } else {
            this.inventarioSucursal = [];
          }
        }
        this.modalService.exito('Sucursal eliminada correctamente.');
        this.idEliminar = null;
        this.nombreEliminar = '';
      },
      error: (err) => {
        const mensaje =
          err.error?.detail ||
          err.error?.error ||
          'No se puede eliminar la sucursal porque posee stock activo o movimientos vinculados.';
        this.modalService.error(mensaje);
        this.idEliminar = null;
        this.nombreEliminar = '';
      },
    });
  }

  // Métricas acumuladas de la red
  get totalArticulosRed(): number {
    return this.sucursales.length > 0 ? (this.sucursales[0].total_articulos || 0) : 0;
  }

  get totalSinStockRed(): number {
    return this.sucursales.reduce((acc, s) => acc + (s.articulos_sin_stock || 0), 0);
  }

  get sedesConAlerta(): number {
    return this.sucursales.filter((s) => (s.articulos_alerta || 0) > 0).length;
  }
}
