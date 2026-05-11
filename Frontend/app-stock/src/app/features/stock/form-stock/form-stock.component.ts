import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { StockSucursalService } from '../../../core/services/stock-sucursal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-stock',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-stock.component.html',
  styleUrl: './form-stock.component.css',
})
export class FormStockComponent implements OnInit {
  formulario: FormGroup;
  id!: number;
  cargando = true;
  guardando = false;
  registroOriginal: any = null; // guardamos el registro completo

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private stockService: StockSucursalService,
  ) {
    this.formulario = this.fb.group({
      cantidad_stock: ['', [Validators.required, Validators.min(0)]],
      stock_min: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.stockService.getById(this.id).subscribe({
      next: (data) => {
        this.registroOriginal = data; // guardamos todo el objeto
        this.formulario.patchValue({
          cantidad_stock: data.cantidad_stock,
          stock_min: data.stock_min,
        });
        this.cargando = false;
      },
      error: () => {
        alert('No se pudo cargar el registro.');
        this.router.navigate(['/dashboard/stock']);
      },
    });
  }

  guardar(): void {
    if (this.formulario.invalid) return;
    this.guardando = true;

    // mandamos el objeto completo con los campos editados
    const payload = {
      ...this.registroOriginal,
      cantidad_stock: this.formulario.value.cantidad_stock,
      stock_min: this.formulario.value.stock_min,
    };

    this.stockService.update(this.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/stock']).then(() => {
          window.location.reload();
        });
      },
      error: () => {
        alert('Error al guardar. Verificá que el backend esté corriendo.');
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/stock']);
  }
}
