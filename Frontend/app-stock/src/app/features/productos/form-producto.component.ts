import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importar módulos reactivos
import { ProductoService } from '../../core/services/producto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { ModalService } from '../../core/services/modal.service';


@Component({
  selector: 'app-form-producto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-producto.component.html',
  styleUrls: ['./form-producto.component.css']
})
export class FormProductoComponent implements OnInit {

  categorias: any[] = [];
  productoForm!: FormGroup; // Definición del contenedor del formulario  

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.initForm();
    this.cargarCategorias();
  }

  initForm() {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      precio_venta: [null, [Validators.required]],
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

  // variable para almacenar los errores
  erroresBackend: any = null;

  guardar() {
    // 1. Limpiar errores previos ante un nuevo intento de envío
    this.erroresBackend = null;

    // 2. Validación preventiva en Frontend
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    // 3. Extracción de datos del Formulario Reactivo
    const productoData = this.productoForm.value;

    // 4. Envío al Servicio HTTP
    this.productoService.create(productoData).subscribe({
      next: () => {
        this.modalService.exito('Producto guardado correctamente');
        this.productoForm.reset();
        this.erroresBackend = null; // Limpiar errores después de un envío exitoso
      },
      error: (err) => {

        // 5. Interceptación de errores de validación de Django (HTTP 400)
        if (err.error && err.error.detalle) {
          this.erroresBackend = err.error.detalle;
        } else {
          // Fallback para caídas de servidor o errores 500
          this.erroresBackend = err.error;
        }
      }
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