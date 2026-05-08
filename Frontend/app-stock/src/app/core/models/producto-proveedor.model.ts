import { Producto } from './producto.model';
import { Proveedor } from './proveedor.model';

export interface ProductoProveedor {
  id_enlace: number;
  id_art: number;
  id_prov: number;
  precio_costo: number;
  // Opcionales por si el backend los devuelve anidados
  producto?: Producto;
  proveedor?: Proveedor;
}