import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MovimientoService } from '../../core/services/movimiento.service';
import { Movimiento } from '../../core/models/movimiento.model';

@Component({
  selector: 'app-lista-movimientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-movimientos.component.html',
  styleUrl: './lista-movimientos.component.css',
})
export class ListaMovimientosComponent implements OnInit {
  movimientos: Movimiento[] = [];
  cargando = true;
  error = '';

  constructor(
    private movimientoService: MovimientoService,
    private router: Router,
  ) {}

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
  }

  irNuevoMovimiento(): void {
    this.router.navigate(['/dashboard/movimientos/nuevo']);
  }
}
