import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-form-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-producto.component.html',
  styleUrls: ['./form-producto.component.css']
})
export class FormProductoComponent implements OnInit {

  categorias: any[] = [];
  productoForm!: FormGroup;
  esEdicion: boolean = false;
  productoId: number | null = null;
  cargando: boolean = false;
  erroresBackend: any = null;

  // Modal rápido de nueva categoría
  mostrarModalCategoria: boolean = false;
  nombreNuevaCategoria: string = '';
  guardandoCategoria: boolean = false;
  errorModalCategoria: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.initForm();
    this.cargarCategorias();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      this.productoId = Number(idParam);
      this.cargarProducto(this.productoId);
    }
  }

  initForm() {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      precio_venta: [null, [Validators.required, Validators.min(0)]],
      id_cat: ['', [Validators.required]],
      descripcion: ['']
    });
  }

  cargarCategorias() {
    this.categoriaService.getAll().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  cargarProducto(id: number) {
    this.cargando = true;
    this.productoService.getById(id).subscribe({
      next: (prod) => {
        this.cargando = false;
        this.productoForm.patchValue({
          nombre: prod.nombre,
          codigo: prod.codigo,
          precio_venta: prod.precio_venta,
          id_cat: prod.id_cat,
          descripcion: prod.descripcion || ''
        });
      },
      error: (err) => {
        this.cargando = false;
        this.modalService.error('No se pudo cargar la información del producto.');
        this.router.navigate(['/dashboard/productos']);
      }
    });
  }

  guardar() {
    this.erroresBackend = null;

    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const productoData = this.productoForm.value;

    if (this.esEdicion && this.productoId) {
      this.productoService.update(this.productoId, productoData).subscribe({
        next: () => {
          this.modalService.exito('Producto actualizado correctamente');
          this.router.navigate(['/dashboard/productos']);
        },
        error: (err) => {
          if (err.error && err.error.detalle) {
            this.erroresBackend = err.error.detalle;
          } else {
            this.erroresBackend = err.error;
          }
        }
      });
    } else {
      this.productoService.create(productoData).subscribe({
        next: () => {
          this.modalService.exito('Producto guardado correctamente');
          this.router.navigate(['/dashboard/productos']);
        },
        error: (err) => {
          if (err.error && err.error.detalle) {
            this.erroresBackend = err.error.detalle;
          } else {
            this.erroresBackend = err.error;
          }
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/dashboard/productos']);
  }

  // --- Modal Rápido de Categoría ---
  abrirModalCategoria(): void {
    this.nombreNuevaCategoria = '';
    this.errorModalCategoria = '';
    this.mostrarModalCategoria = true;
  }

  cerrarModalCategoria(): void {
    this.mostrarModalCategoria = false;
    this.nombreNuevaCategoria = '';
    this.errorModalCategoria = '';
  }

  guardarNuevaCategoria(): void {
    const nombreLimpio = this.nombreNuevaCategoria.trim();
    if (!nombreLimpio) {
      this.errorModalCategoria = 'El nombre de la categoría es obligatorio.';
      return;
    }

    this.guardandoCategoria = true;
    this.errorModalCategoria = '';

    this.categoriaService.create({ nombre: nombreLimpio }).subscribe({
      next: (nuevaCat) => {
        this.guardandoCategoria = false;
        this.modalService.exito(`Categoría "${nuevaCat.nombre}" creada y seleccionada.`);
        this.cargarCategorias();
        this.productoForm.patchValue({ id_cat: nuevaCat.id_cat });
        this.cerrarModalCategoria();
      },
      error: (err) => {
        this.guardandoCategoria = false;
        this.errorModalCategoria =
          err.error?.nombre?.[0] ||
          err.error?.detail ||
          err.error?.error ||
          'Error al crear la categoría.';
      },
    });
  }

  resetForm() {
    this.productoForm.reset({
      nombre: '',
      codigo: '',
      precio_venta: null,
      id_cat: '',
      descripcion: ''
    });
  }
}