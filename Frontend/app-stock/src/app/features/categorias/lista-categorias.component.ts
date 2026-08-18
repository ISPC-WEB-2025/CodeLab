import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { CategoriaService } from '../../core/services/categoria.service';
import { ModalService } from '../../core/services/modal.service';
import { Categoria } from '../../core/models/categoria.model';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-categorias.component.html',
  styleUrl: './lista-categorias.component.css',
})
export class ListaCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  cargando: boolean = true;
  error: string = '';
  terminoBusqueda: string = '';

  // Categoría seleccionada para inspección rápida de productos
  categoriaSeleccionada: Categoria | null = null;
  productosCategoria: Producto[] = [];
  cargandoProductos: boolean = false;
  busquedaProducto: string = '';

  // Formulario ágil (Creación / Edición in-situ)
  modoEdicion: boolean = false;
  categoriaEditandoId: number | null = null;
  nombreFormulario: string = '';
  guardando: boolean = false;
  errorFormulario: string = '';

  // Eliminación protegida
  idEliminar: number | null = null;
  nombreEliminar: string = '';
  articulosEliminar: number = 0;

  private busqueda$ = new Subject<string>();

  constructor(
    private categoriaService: CategoriaService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();

    this.busqueda$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((termino) => {
          this.cargando = true;
          return this.categoriaService.getAll(termino);
        })
      )
      .subscribe({
        next: (data) => {
          this.categorias = data;
          this.cargando = false;
          this.error = '';
          if (this.categoriaSeleccionada) {
            const match = data.find((c) => c.id_cat === this.categoriaSeleccionada?.id_cat);
            if (match) this.categoriaSeleccionada = match;
          }
        },
        error: () => {
          this.error = 'Ocurrió un error al buscar categorías.';
          this.cargando = false;
        },
      });
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.error = '';
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargando = false;
        if (data.length > 0 && !this.categoriaSeleccionada) {
          this.seleccionarCategoria(data[0]);
        }
      },
      error: () => {
        this.error = 'No se pudieron cargar las categorías. Verificá que el backend esté en ejecución.';
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

  seleccionarCategoria(cat: Categoria): void {
    this.categoriaSeleccionada = cat;
    this.cargarProductosDeCategoria(cat.id_cat!);
  }

  cargarProductosDeCategoria(idCat: number): void {
    this.cargandoProductos = true;
    this.categoriaService.getProductos(idCat, this.busquedaProducto).subscribe({
      next: (prods) => {
        this.productosCategoria = prods;
        this.cargandoProductos = false;
      },
      error: () => {
        this.productosCategoria = [];
        this.cargandoProductos = false;
      },
    });
  }

  onBusquedaProducto(): void {
    if (!this.categoriaSeleccionada?.id_cat) return;
    this.cargarProductosDeCategoria(this.categoriaSeleccionada.id_cat);
  }

  limpiarBusquedaProducto(): void {
    this.busquedaProducto = '';
    this.onBusquedaProducto();
  }

  // --- Formulario Ágil (Crear / Editar) ---
  iniciarCreacion(): void {
    this.modoEdicion = false;
    this.categoriaEditandoId = null;
    this.nombreFormulario = '';
    this.errorFormulario = '';
  }

  iniciarEdicion(cat: Categoria, event?: Event): void {
    if (event) event.stopPropagation();
    this.modoEdicion = true;
    this.categoriaEditandoId = cat.id_cat!;
    this.nombreFormulario = cat.nombre;
    this.errorFormulario = '';
  }

  cancelarEdicion(): void {
    this.iniciarCreacion();
  }

  guardarCategoria(): void {
    const nombreLimpio = this.nombreFormulario.trim();
    if (!nombreLimpio) {
      this.errorFormulario = 'El nombre de la categoría es obligatorio.';
      return;
    }

    this.guardando = true;
    this.errorFormulario = '';

    if (this.modoEdicion && this.categoriaEditandoId) {
      this.categoriaService.update(this.categoriaEditandoId, { nombre: nombreLimpio }).subscribe({
        next: (catActualizada) => {
          this.guardando = false;
          this.modalService.exito(`Categoría "${catActualizada.nombre}" actualizada.`);
          this.iniciarCreacion();
          this.cargarCategorias();
        },
        error: (err) => {
          this.guardando = false;
          this.errorFormulario =
            err.error?.nombre?.[0] ||
            err.error?.detail ||
            err.error?.error ||
            'Error al actualizar la categoría.';
        },
      });
    } else {
      this.categoriaService.create({ nombre: nombreLimpio }).subscribe({
        next: (nuevaCat) => {
          this.guardando = false;
          this.modalService.exito(`Categoría "${nuevaCat.nombre}" creada exitosamente.`);
          this.iniciarCreacion();
          this.cargarCategorias();
          this.seleccionarCategoria(nuevaCat);
        },
        error: (err) => {
          this.guardando = false;
          this.errorFormulario =
            err.error?.nombre?.[0] ||
            err.error?.detail ||
            err.error?.error ||
            'Error al registrar la categoría.';
        },
      });
    }
  }

  // --- Eliminación Protegida ---
  prepararEliminacion(cat: Categoria, event?: Event): void {
    if (event) event.stopPropagation();
    this.idEliminar = cat.id_cat!;
    this.nombreEliminar = cat.nombre;
    this.articulosEliminar = cat.total_articulos || 0;
  }

  confirmarEliminacion(): void {
    if (this.idEliminar === null) return;

    if (this.articulosEliminar > 0) {
      this.modalService.error(
        `No se puede eliminar "${this.nombreEliminar}" porque posee ${this.articulosEliminar} producto(s) asociado(s).`
      );
      this.idEliminar = null;
      return;
    }

    const id = this.idEliminar;
    this.categoriaService.delete(id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter((c) => c.id_cat !== id);
        if (this.categoriaSeleccionada?.id_cat === id) {
          this.categoriaSeleccionada = this.categorias.length > 0 ? this.categorias[0] : null;
          if (this.categoriaSeleccionada) {
            this.seleccionarCategoria(this.categoriaSeleccionada);
          } else {
            this.productosCategoria = [];
          }
        }
        if (this.categoriaEditandoId === id) {
          this.iniciarCreacion();
        }
        this.modalService.exito('Categoría eliminada correctamente.');
        this.idEliminar = null;
        this.nombreEliminar = '';
      },
      error: (err) => {
        const mensaje =
          err.error?.detail ||
          err.error?.error ||
          'No se pudo eliminar la categoría.';
        this.modalService.error(mensaje);
        this.idEliminar = null;
        this.nombreEliminar = '';
      },
    });
  }
}
