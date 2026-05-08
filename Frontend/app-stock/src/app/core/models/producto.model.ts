import { Categoria } from './categoria.model';

export interface Producto {
  id_art: number;
  nombre: string;
  descripcion?: string;    // NULL en el modelo → opcional en TypeScript
  codigo: string;
  precio_venta?: number;   // NULL en el modelo → opcional
  id_cat: number;
  categoria?: Categoria;   // Para cuando el backend devuelva el objeto anidado
}