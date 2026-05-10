import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { StockSucursalService } from '../../core/services/stock-sucursal.service';
import { StockSucursal } from '../../core/models/stock-sucursal.model'

@Component({
  selector: 'app-stock-sucursal',
  imports: [CommonModule],
  templateUrl: './stock-sucursal.component.html',
  styleUrl: './stock-sucursal.component.css'
})

export class StockSucursalComponent implements OnInit {

  // Lista de stock del backend:
  stockLista: StockSucursal[] = []; // creamos array vacío para llenar con los datos

  // Para manejar estados de carga y errores:
  cargando: boolean = true; // inicialmente cargando
  error: string = ''; // inicialmente sin error

  constructor(private stockService: StockSucursalService) { }  // inyectamos el servicio para usarlo

  // datos de Prueba de stock (mismos que cargados en db)
  ngOnInit(): void { 
  this.stockLista  = [
    { id_stock: 1, cantidad_stock: 150, stock_min: 50, id_art: 1, id_suc: 1, nombre_producto: 'Perfil de aluminio 45mm', nombre_sucursal: 'Fábrica Principal' },
    { id_stock: 2, cantidad_stock: 20, stock_min: 5, id_art: 2, id_suc: 1, nombre_producto: 'Motor Tubular 50Nm', nombre_sucursal: 'Fábrica Principal' },
    { id_stock: 3, cantidad_stock: 500, stock_min: 100, id_art: 3, id_suc: 2, nombre_producto: 'Lama de aluminio inyectado', nombre_sucursal: 'Depósito Zona Sur' }
  ];
  this.cargando = false;
}

}

  
