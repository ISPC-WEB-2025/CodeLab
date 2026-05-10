import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StockSucursalService } from '../../core/services/stock-sucursal.service';
import { StockSucursal } from '../../core/models/stock-sucursal.model';

@Component({
  selector: 'app-stock-sucursal',
  imports: [CommonModule],
  templateUrl: './stock-sucursal.component.html',
  styleUrl: './stock-sucursal.component.css',
})
export class StockSucursalComponent implements OnInit {
  // Lista de stock del backend:
  stockLista: StockSucursal[] = []; // creamos array vacío para llenar con los datos

  // Para manejar estados de carga y errores:
  cargando: boolean = true; // inicialmente cargando
  error: string = ''; // inicialmente sin error

  constructor(
    private stockService: StockSucursalService,
    private router: Router,
  ) {}
  eliminar(id: number): void {
    if (confirm('¿Estás seguro que querés eliminar este registro?')) {
      this.stockService.delete(id).subscribe({
        next: () => {
          this.stockLista = this.stockLista.filter(
            (item) => item.id_stock !== id,
          );
        },
        error: () => {
          alert('Error al eliminar. Verificá que el backend esté corriendo.');
        },
      });
    }
  }
  editar(id: number): void {
    this.router.navigate(['/dashboard/stock/editar', id]);
  }
  ngOnInit(): void {
    // Datos hardcodeados temporalmente (reflejan los datos de prueba de la DB)
    // TODO: reemplazar por this.stockService.getAll().subscribe() cuando se resuelva CORS con el backend
    this.stockLista = [
      {
        id_stock: 1,
        cantidad_stock: 150,
        stock_min: 50,
        id_art: 1,
        id_suc: 1,
        nombre_producto: 'Perfil de aluminio 45mm',
        nombre_sucursal: 'Fábrica Principal',
      },
      {
        id_stock: 2,
        cantidad_stock: 20,
        stock_min: 5,
        id_art: 2,
        id_suc: 1,
        nombre_producto: 'Motor Tubular 50Nm',
        nombre_sucursal: 'Fábrica Principal',
      },
      {
        id_stock: 3,
        cantidad_stock: 500,
        stock_min: 100,
        id_art: 3,
        id_suc: 2,
        nombre_producto: 'Lama de aluminio inyectado',
        nombre_sucursal: 'Depósito Zona Sur',
      },
    ];
    this.cargando = false;
  }
}
