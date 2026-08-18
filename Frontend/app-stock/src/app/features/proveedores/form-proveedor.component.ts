import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ProveedorService } from '../../core/services/proveedor.service';
import { ModalService } from '../../core/services/modal.service';
import { Proveedor } from '../../core/models/proveedor.model';

@Component({
  selector: 'app-form-proveedor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-proveedor.component.html',
  styleUrl: './form-proveedor.component.css',
})
export class FormProveedorComponent implements OnInit {
  proveedorForm!: FormGroup;
  esEdicion: boolean = false;
  idProveedor: number | null = null;
  cargando: boolean = false;
  guardando: boolean = false;
  erroresBackend: any = null;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.detectarModoEdicion();
  }

  initForm(): void {
    this.proveedorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      cuit: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9\-\s]{10,20}$/),
        ],
      ],
      telefono: ['', [Validators.required, Validators.maxLength(30)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(150),
        ],
      ],
      direccion: ['', [Validators.required, Validators.maxLength(300)]],
    });
  }

  detectarModoEdicion(): void {
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.esEdicion = true;
      this.idProveedor = Number(idParam);
      this.cargarDatosProveedor(this.idProveedor);
    }
  }

  cargarDatosProveedor(id: number): void {
    this.cargando = true;
    this.proveedorService.getById(id).subscribe({
      next: (proveedor: Proveedor) => {
        this.proveedorForm.patchValue({
          nombre: proveedor.nombre,
          cuit: proveedor.cuit,
          telefono: proveedor.telefono,
          email: proveedor.email,
          direccion: proveedor.direccion,
        });
        this.cargando = false;
      },
      error: () => {
        this.modalService.error('No se pudo encontrar la información del proveedor solicitado.');
        this.cargando = false;
        this.router.navigate(['/dashboard/proveedores']);
      },
    });
  }

  guardar(): void {
    this.erroresBackend = null;

    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const datosProveedor: Proveedor = {
      id_prov: this.idProveedor ?? 0,
      ...this.proveedorForm.value,
    };

    if (this.esEdicion && this.idProveedor) {
      this.proveedorService.update(this.idProveedor, datosProveedor).subscribe({
        next: () => {
          this.guardando = false;
          this.modalService.exito('Proveedor actualizado exitosamente.');
          this.router.navigate(['/dashboard/proveedores']);
        },
        error: (err) => {
          this.guardando = false;
          this.manejarErrorBackend(err);
        },
      });
    } else {
      this.proveedorService.create(datosProveedor).subscribe({
        next: () => {
          this.guardando = false;
          this.modalService.exito('Proveedor registrado exitosamente.');
          this.router.navigate(['/dashboard/proveedores']);
        },
        error: (err) => {
          this.guardando = false;
          this.manejarErrorBackend(err);
        },
      });
    }
  }

  private manejarErrorBackend(err: any): void {
    if (err.error) {
      if (typeof err.error === 'object') {
        this.erroresBackend = err.error;
      } else {
        this.erroresBackend = { general: err.error };
      }
    } else {
      this.erroresBackend = {
        general: 'Error de comunicación con el servidor. Verificá que el backend esté en ejecución.',
      };
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/proveedores']);
  }
}
