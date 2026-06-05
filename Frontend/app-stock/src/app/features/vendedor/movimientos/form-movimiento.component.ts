import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { MovimientoService } from '../../../core/services/movimiento.service';
import { ProductoService } from '../../../core/services/producto.service';
import { StockSucursalService } from '../../../core/services/stock-sucursal.service';
import { Producto } from '../../../core/models/producto.model';
import { StockSucursal } from '../../../core/models/stock-sucursal.model';

@Component({
  selector: 'app-form-movimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-movimiento.component.html',
  styleUrl: './form-movimiento.component.css',
})
export class FormMovimientoComponent implements OnInit {
  formulario: FormGroup;
  todosLosProductos: Producto[] = [];
  todoElStock: StockSucursal[] = [];
  sucursales: { id: number, nombre: string }[] = [];  // ← sucursales únicas
  productosFiltrados: Producto[] = [];                // ← productos de la sucursal elegida
  stockDisponible: number | null = null;
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
      id_suc: ['', Validators.required],   // ← sucursal primero
      id_art: ['', Validators.required],   // ← producto segundo
      cantidad: ['', [Validators.required, Validators.min(1)]],
      motivo: [''],
    });
  }

  ngOnInit(): void {
    this.productoService.getAll().subscribe({
      next: (data) => (this.todosLosProductos = data),
      error: () => (this.errorMsg = 'No se pudieron cargar los productos.'),
    });

    this.stockService.getAll().subscribe({
      next: data => {
        this.todoElStock = data;
        // Extraer sucursales únicas
        const mapa = new Map<number, string>();
        data.forEach(s => mapa.set(s.id_suc, s.nombre_sucursal ?? ''));
        this.sucursales = Array.from(mapa.entries()).map(([id, nombre]) => ({ id, nombre }));
      },
      error: () => (this.errorMsg = 'No se pudo cargar el stock.'),

    });

    // Cuando cambia la sucursal, filtrar productos disponibles en esa sucursal
    this.formulario.get('id_suc')?.valueChanges.subscribe(idSucursal => {
      this.formulario.get('id_art')?.reset('');  // Resetear sucursal al cambiar producto y limpia el estado
      this.stockDisponible = null;

      if (idSucursal) {
        const idsProductos = this.todoElStock
          .filter(s => s.id_suc == idSucursal)
          .map(s => s.id_art);
        this.productosFiltrados = this.todosLosProductos.filter(
          p => p.id_art !== undefined && idsProductos.includes(p.id_art)
        );
      } else {
        this.productosFiltrados = [];
      }
    });

    // Cuando cambia el producto → mostrar stock disponible
    this.formulario.get('id_art')?.valueChanges.subscribe(idProducto => {
      const idSucursal = this.formulario.get('id_suc')?.value;
      if (idProducto && idSucursal) {
        const registro = this.todoElStock.find(
          s => s.id_art == idProducto && s.id_suc == idSucursal
        );
        this.stockDisponible = registro ? registro.cantidad_stock : null;
      } else {
        this.stockDisponible = null;
      }
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
      id_usuario: null,
    };

    this.movimientoService.create(payload).subscribe({
      next: () => {
        this.exitoso = true;
        this.guardando = false;
        setTimeout(
          () => this.router.navigate(['/vendedor/movimientos']),
          1500,
        );
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Error al registrar el movimiento.';
        if (err.error?.stock_disponible !== undefined) {
          this.errorMsg += ` Stock disponible: ${err.error.stock_disponible} unidades.`;
        }
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/vendedor/movimientos']);
  }
}
