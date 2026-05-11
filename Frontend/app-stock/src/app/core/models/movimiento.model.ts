import { Producto } from './producto.model';
import { Sucursal } from './sucursal.model';
import { Proveedor } from './proveedor.model';

export type TipoMovimiento = 'Entrada' | 'Salida' | 'Traslado';

export interface Movimiento {
  id_mov: number;
  tipo: TipoMovimiento;
  fecha_hora: string;       // Las fechas viajan como string en JSON
  cantidad: number;
  motivo?: string;          // NULL en el modelo → opcional
  id_art: number;
  id_suc: number;
  id_prov?: number;         // NULL en el modelo → opcional
  // Opcionales por si el backend los devuelve anidados
  producto?: Producto;
  sucursal?: Sucursal;
  proveedor?: Proveedor;
}