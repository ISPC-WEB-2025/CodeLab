import { Producto } from './producto.model';
import { Sucursal } from './sucursal.model';

export interface StockSucursal {
  id_stock: number;
  cantidad_stock: number;
  stock_min: number;
  id_art: number;
  id_suc: number;
  // Opcionales por si el backend los devuelve anidados
  producto?: Producto;
  sucursal?: Sucursal;
}