export interface Usuario {
  id?: number;              // Opcional porque el backend lo asigna automáticamente al crear un nuevo usuario
  email: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento: string; // Angular maneja las fechas que vienen del backend como strings 'YYYY-MM-DD'
  rol: number;              // mandamos y recibimos el ID del rol
  password?: string;        // Opcional porque la mostramos solo al crear/editar, pero el backend no la devuelve al listar
}

