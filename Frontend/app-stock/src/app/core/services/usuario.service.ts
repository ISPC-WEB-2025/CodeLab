import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model'; // Ajustá esta ruta según dónde guardaste la interfaz

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // La ruta base exacta que configuraste en tu backend
  private apiUrl = 'http://127.0.0.1:8000/api/usuarios/';

  constructor(private http: HttpClient) { }

  // 1. GET: Traer la lista completa de usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // 2. GET: Traer un solo usuario por su ID (para cuando quieras editar)
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}${id}/`);
  }

  // 3. POST: Crear un usuario nuevo
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  // 4. PUT: Actualizar un usuario existente
  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}${id}/`, usuario);
  }

  // 5. DELETE: Borrar un usuario
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}