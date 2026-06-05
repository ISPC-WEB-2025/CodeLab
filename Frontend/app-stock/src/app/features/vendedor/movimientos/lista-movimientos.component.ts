import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MovimientoService } from '../../../core/services/movimiento.service';
import { Movimiento } from '../../../core/models/movimiento.model';
import { StockSucursalService } from '../../../core/services/stock-sucursal.service';
import { StockSucursal } from '../../../core/models/stock-sucursal.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-movimientos.component.html',
  styleUrl: './lista-movimientos.component.css',
})
export class ListaMovimientosComponent implements OnInit {
  movimientos: Movimiento[] = [];
  cargando = true;
  error = '';
  sucursales: { id: number, nombre: string }[] = [];
  sucursalSeleccionada: number | null = null;
  stockTotal: StockSucursal[] = [];
  // Para el filtro de sucursales
  get movimientosFiltrados() {
    if (!this.sucursalSeleccionada) return this.movimientos;
    return this.movimientos.filter(m => m.id_suc === this.sucursalSeleccionada);
  }

  constructor(
    private movimientoService: MovimientoService,
    private router: Router,
    private stockService: StockSucursalService

  ) { }

  ngOnInit(): void {
    this.movimientoService.getAll().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los movimientos.';
        this.cargando = false;
      },
    });

    // Cargar sucursales para el filtro
    this.stockService.getAll().subscribe(data => {
      const mapa = new Map<number, string>();
      data.forEach(s => mapa.set(s.id_suc, s.nombre_sucursal!));
      this.sucursales = Array.from(mapa.entries()).map(([id, nombre]) => ({ id, nombre }));
    });
  }

  irNuevoMovimiento(): void {
    this.router.navigate(['/vendedor/movimientos/nuevo']);
  }

  // Método para obtener el stock de un producto en la sucursal seleccionada
  getStock(id_art: number): number | null {
    if (!this.sucursalSeleccionada) return null;
    const registro = this.stockTotal.find(
      s => s.id_art === id_art && s.id_suc === this.sucursalSeleccionada
    );
    return registro ? registro.cantidad_stock : null;
  }
}
