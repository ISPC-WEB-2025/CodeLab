import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { MovimientoService } from '../../core/services/movimiento.service';
import { ProductoService } from '../../core/services/producto.service';
import { StockSucursalService } from '../../core/services/stock-sucursal.service';
import { Producto } from '../../core/models/producto.model';
import { StockSucursal } from '../../core/models/stock-sucursal.model';

@Component({
  selector: 'app-form-movimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-movimiento.component.html',
  styleUrl: './form-movimiento.component.css',
})
export class FormMovimientoComponent implements OnInit {
  formulario: FormGroup;
  productos: Producto[] = [];
  sucursales: StockSucursal[] = [];
  guardando = false;
  errorMsg = '';
  exitoso = false;

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private productoService: ProductoService,
    private stockService: StockSucursalService,
    private router: Router,
  ) {
    this.formulario = this.fb.group({
      tipo: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      motivo: [''],
      id_art: ['', Validators.required],
      id_suc: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.productoService.getAll().subscribe({
      next: (data) => (this.productos = data),
      error: () => (this.errorMsg = 'No se pudieron cargar los productos.'),
    });

    this.stockService.getAll().subscribe({
      next: (data) => (this.sucursales = data),
      error: () => (this.errorMsg = 'No se pudieron cargar las sucursales.'),
    });
  }

  guardar(): void {
    if (this.formulario.invalid) return;

    this.guardando = true;
    this.errorMsg = '';

    const payload = {
      ...this.formulario.value,
      fecha_hora: new Date().toISOString(),
      id_prov: null,
      // id_usuario: null, - backend asignará el usuario autenticado automáticamente, no es necesario enviarlo desde el frontend
    };

    this.movimientoService.create(payload).subscribe({
      next: () => {
        this.exitoso = true;
        this.guardando = false;
        setTimeout(
          () => this.router.navigate(['/dashboard/movimientos']),
          1500,
        );
      },
      error: (err) => {
        console.log('❌ Error completo:', err);
        console.log('Status:', err.status);
        console.log('Response:', err.error);

        this.errorMsg = err.error?.error || 'Error al registrar el movimiento.';
        if (err.error?.stock_disponible !== undefined) {
          this.errorMsg += ` Stock disponible: ${err.error.stock_disponible} unidades.`;
        }
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/movimientos']);
  }
}
