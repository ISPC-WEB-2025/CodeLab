import { Categoria } from './categoria.model';

export interface Producto {
  id_art?: number; //Asignado por la bdd // Opcional porque al crear (POST) no lo tenemos, lo asigna la BD
  nombre: string;
  descripcion?: string | null;   // NULL en el modelo → opcional en TypeScript
  codigo: string;
  precio_venta?: string | number | null;   // NULL en el modelo → opcional // string xq DRF convierte decimal a string en el JSON (evitar precisión en los centavos)
  id_cat: number | null; // Null para inicializar formularios vacíos
  categoria?: Categoria;   // Para cuando el backend devuelva el objeto anidado
  stock_min_global?: number;
  stock_total?: number;
  proveedores?: {
    id_prov: number;
    nombre: string;
    cuit: string;
    precio_costo?: number | string;
  }[];
}
