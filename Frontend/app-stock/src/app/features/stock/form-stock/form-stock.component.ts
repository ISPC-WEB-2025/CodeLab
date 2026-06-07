import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ModalService } from '../../../core/services/modal.service';
import { StockSucursalService } from '../../../core/services/stock-sucursal.service';


@Component({
  selector: 'app-form-stock',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-stock.component.html',
  styleUrl: './form-stock.component.css',
})
export class FormStockComponent implements OnInit {
  formulario: FormGroup;
  id!: number;
  modoCrear = false; // true si es creación, false si es edición
  cargando = true;
  guardando = false;
  registroOriginal: any = null; // guardamos el registro completo

  // Para mostrar opciones de productos y sucursales en selects, aunque no se puedan editar  
  productos: { id_art: number; nombre: string }[] = [];
  sucursales: { id_suc: number; nombre: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: ModalService,
    private stockService: StockSucursalService,
    private http: HttpClient,
  ) {
    this.formulario = this.fb.group({
      id_art: [null],
      id_suc: [null],
      cantidad_stock: ['', [Validators.required, Validators.min(0)]],
      stock_min: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');  // Si hay id, es modo edición; si no, es modo creación
    this.modoCrear = !idParam;

    if (this.modoCrear) {
      this.formulario.get('id_art')!.setValidators(Validators.required);
      this.formulario.get('id_suc')!.setValidators(Validators.required);
      this.formulario.get('id_art')!.updateValueAndValidity();
      this.formulario.get('id_suc')!.updateValueAndValidity();


      this.http.get<any[]>('http://localhost:8000/api/inventario/productos/').subscribe({
        next: (data) => this.productos = data.map(p => ({ id_art: p.id_art, nombre: p.nombre })),
      });
      this.http.get<any[]>('http://localhost:8000/api/inventario/sucursales/').subscribe({
        next: (data) => this.sucursales = data.map(s => ({ id_suc: s.id_suc, nombre: s.nombre })),
      });
      this.cargando = false;
    } else {
      this.id = Number(idParam);
      this.stockService.getById(this.id).subscribe({
        next: (data) => {
          this.registroOriginal = data;
          this.formulario.patchValue({
            cantidad_stock: data.cantidad_stock,
            stock_min: data.stock_min,
          });
          this.cargando = false;
        },
        error: () => {
          this.modalService.error('No se pudo cargar el registro.');
          this.router.navigate(['/dashboard/stock']);
        },
      });
    }
  }

  guardar(): void {
    if (this.formulario.invalid) return;
    this.guardando = true;

    if (this.modoCrear) {
      const payload = this.formulario.value;
      this.stockService.create(payload).subscribe({
        next: () => this.router.navigate(['/dashboard/stock']),
        error: async () => {
          await this.modalService.error('Error al crear. Es posible que ya exista stock para ese producto en esa sucursal.');
          this.guardando = false;
        },
      });
    } else {
      // mandamos el objeto completo con los campos editados
      const payload = {
        ...this.registroOriginal,
        cantidad_stock: this.formulario.value.cantidad_stock,
        stock_min: this.formulario.value.stock_min,
      };

      this.stockService.update(this.id, payload).subscribe({
        next: () =>
          this.router.navigate(['/dashboard/stock']).then(() =>
            window.location.reload()),

        error: () => {
          this.modalService.error('Error al guardar. Verificá que el backend esté corriendo.');
          this.guardando = false;
        },
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/stock']);
  }
}
