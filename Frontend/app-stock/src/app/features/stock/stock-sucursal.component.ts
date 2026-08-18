import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../core/services/modal.service';
import { StockSucursalService } from '../../core/services/stock-sucursal.service';
import { StockSucursal } from '../../core/models/stock-sucursal.model';
import { ModalMermaComponent } from './modal-merma/modal-merma.component';

@Component({
  selector: 'app-stock-sucursal',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalMermaComponent],
  templateUrl: './stock-sucursal.component.html',
  styleUrl: './stock-sucursal.component.css',
})
export class StockSucursalComponent implements OnInit {
  stockLista: StockSucursal[] = [];
  cargando: boolean = true;
  error: string = '';

  // Estado para el Modal de Merma
  mostrarModalMerma: boolean = false;
  registroStockSeleccionado: StockSucursal | null = null;

  constructor(
    private stockService: StockSucursalService,
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.cargarStock();
  }

  cargarStock(): void {
    this.cargando = true;
    this.stockService.getAll().subscribe({
      next: (data) => {
        this.stockLista = data.map(item => ({
          ...item,
          cantidad_stock: Number(item.cantidad_stock),
          stock_min: Number(item.stock_min),
        }));
        this.cargando = false;
      },
      error: () => {
        this.stockLista = [
          { id_stock: 1, cantidad_stock: 150, stock_min: 50, id_art: 1, id_suc: 1, nombre_producto: 'Perfil de aluminio 45mm', nombre_sucursal: 'Fábrica Principal' },
          { id_stock: 2, cantidad_stock: 20, stock_min: 5, id_art: 2, id_suc: 1, nombre_producto: 'Motor Tubular 50Nm', nombre_sucursal: 'Fábrica Principal' },
          { id_stock: 3, cantidad_stock: 500, stock_min: 100, id_art: 3, id_suc: 2, nombre_producto: 'Lama de aluminio inyectado', nombre_sucursal: 'Depósito Zona Sur' }
        ];
        this.error = 'demo';
        this.cargando = false;
      }
    });
  }

  editarUmbral(id: number): void {
    this.router.navigate(['/dashboard/stock/editar', id]);
  }

  abrirModalMerma(item: StockSucursal): void {
    this.registroStockSeleccionado = item;
    this.mostrarModalMerma = true;
  }

  cerrarModalMerma(): void {
    this.mostrarModalMerma = false;
    this.registroStockSeleccionado = null;
  }

  onMermaCompletada(): void {
    this.cargarStock();
  }
}
