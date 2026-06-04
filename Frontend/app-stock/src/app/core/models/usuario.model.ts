// export interface Usuario {
//   id?: number;              // Opcional porque al crear un usuario nuevo todavía no tiene ID
//   email: string;
//   nombre: string;
//   dni: string;
//   fecha_nacimiento: string; // Angular maneja las fechas que vienen del backend como strings 'YYYY-MM-DD'
//   rol: number;              // mandamos y recibimos el ID del rol
//   password?: string;        // Opcional porque la mostramos solo al crear/editar, pero el backend no la devuelve al listar
// }

export interface Usuario {
  id?: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}