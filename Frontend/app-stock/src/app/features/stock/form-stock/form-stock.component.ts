import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../core/services/modal.service';
import { StockSucursalService } from '../../../core/services/stock-sucursal.service';
import { StockSucursal } from '../../../core/models/stock-sucursal.model';

@Component({
  selector: 'app-form-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-stock.component.html',
  styleUrl: './form-stock.component.css',
})
export class FormStockComponent implements OnInit {
  formulario: FormGroup;
  id!: number;
  cargando = true;
  guardando = false;
  registroOriginal: StockSucursal | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: ModalService,
    private stockService: StockSucursalService,
  ) {
    this.formulario = this.fb.group({
      stock_min: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.stockService.getById(this.id).subscribe({
        next: (data) => {
          this.registroOriginal = data;
          this.formulario.patchValue({
            stock_min: data.stock_min,
          });
          this.cargando = false;
        },
        error: () => {
          this.modalService.error('No se pudo cargar el registro de stock.');
          this.router.navigate(['/dashboard/stock']);
        },
      });
    } else {
      this.router.navigate(['/dashboard/stock']);
    }
  }

  get umbralIngresado(): number {
    const val = Number(this.formulario.get('stock_min')?.value);
    return isNaN(val) ? 0 : val;
  }

  get stockFisico(): number {
    return Number(this.registroOriginal?.cantidad_stock || 0);
  }

  get entraraEnAlerta(): boolean {
    return this.stockFisico <= this.umbralIngresado;
  }

  get porcentajeNivel(): number {
    if (this.umbralIngresado <= 0) return 100;
    const baseSeguridad = this.umbralIngresado * 1.5;
    const calc = Math.round((this.stockFisico / baseSeguridad) * 100);
    return Math.max(5, Math.min(100, calc));
  }

  establecerPreset(valor: number): void {
    this.formulario.patchValue({ stock_min: valor });
  }

  guardar(): void {
    if (this.formulario.invalid || !this.registroOriginal) return;
    this.guardando = true;

    const payload: Partial<StockSucursal> = {
      ...this.registroOriginal,
      stock_min: Number(this.formulario.value.stock_min),
    };

    this.stockService.update(this.id, payload).subscribe({
      next: () => {
        this.modalService.exito('Umbral de stock mínimo actualizado correctamente.');
        this.router.navigate(['/dashboard/stock']);
      },
      error: () => {
        this.modalService.error('Error al guardar. Verificá que el backend esté corriendo.');
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/stock']);
  }
}
