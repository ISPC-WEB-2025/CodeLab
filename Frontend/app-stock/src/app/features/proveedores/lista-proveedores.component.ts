import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { ProveedorService } from '../../core/services/proveedor.service';
import { ModalService } from '../../core/services/modal.service';
import { Proveedor } from '../../core/models/proveedor.model';

@Component({
  selector: 'app-lista-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-proveedores.component.html',
  styleUrl: './lista-proveedores.component.css',
})
export class ListaProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  cargando: boolean = true;
  error: string = '';
  terminoBusqueda: string = '';
  idEliminar: number | null = null;

  private busqueda$ = new Subject<string>();

  constructor(
    private proveedorService: ProveedorService,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();

    this.busqueda$
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((termino) => {
          this.cargando = true;
          return termino.trim()
            ? this.proveedorService.buscarProveedores(termino.trim())
            : this.proveedorService.getAll();
        })
      )
      .subscribe({
        next: (data) => {
          this.proveedores = data;
          this.cargando = false;
          this.error = '';
        },
        error: () => {
          this.error = 'Ocurrió un error al buscar proveedores.';
          this.cargando = false;
        },
      });
  }

  cargarProveedores(): void {
    this.cargando = true;
    this.error = '';
    this.proveedorService.getAll().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los proveedores. Verificá que el backend esté en ejecución.';
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

  irNuevoProveedor(): void {
    this.router.navigate(['/dashboard/proveedores/nuevo']);
  }

  prepararEliminacion(id: number): void {
    this.idEliminar = id;
  }

  confirmarEliminacion(): void {
    if (this.idEliminar === null) return;

    const id = this.idEliminar;
    this.proveedorService.delete(id).subscribe({
      next: () => {
        this.proveedores = this.proveedores.filter((p) => p.id_prov !== id);
        this.modalService.exito('Proveedor eliminado correctamente.');
        this.idEliminar = null;
      },
      error: (err) => {
        const mensaje =
          err.error?.detail ||
          err.error?.error ||
          'No se puede eliminar el proveedor porque posee movimientos o productos asociados.';
        this.modalService.error(mensaje);
        this.idEliminar = null;
      },
    });
  }
}
