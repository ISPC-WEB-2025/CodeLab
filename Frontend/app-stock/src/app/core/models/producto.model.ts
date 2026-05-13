import { Categoria } from './categoria.model';

export interface Producto {
  id_art?: number; //Asignado por la bdd
  nombre: string;
  descripcion?: string;    // NULL en el modelo → opcional en TypeScript
  codigo: string;
  precio_venta?: number|null;   // NULL en el modelo → opcional
  id_cat: number|null;
  categoria?: Categoria;   // Para cuando el backend devuelva el objeto anidado
}