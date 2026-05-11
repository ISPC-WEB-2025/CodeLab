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
  // TODO: configurar CORS en Django si se despliega en producción
  this.stockService.getAll().subscribe({
    next: (data) => {
      this.stockLista = data;
      this.cargando = false;
    },
    error: () => {
      this.error = 'Error al cargar el stock. Verificá que el backend esté corriendo.';
      this.cargando = false;
    }
  });
}
}
