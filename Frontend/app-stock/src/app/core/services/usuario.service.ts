// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Usuario } from '../models/usuario.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class UsuarioService {
//   private http = inject(HttpClient);
//   private apiUrl = 'http://127.0.0.1:8000/api/usuarios/';

//   // constructor(private http: HttpClient) { }

//   // 1. GET: Traer la lista completa de usuarios
//   getUsuarios(): Observable<Usuario[]> {
//     return this.http.get<Usuario[]>(this.apiUrl);
//   }

//   // 2. GET: Traer un solo usuario por su ID (para cuando quieras editar)
//   getUsuario(id: number): Observable<Usuario> {
//     return this.http.get<Usuario>(`${this.apiUrl}${id}/`);
//   }

//   // 3. POST: Crear un usuario nuevo
//   crearUsuario(usuario: Usuario): Observable<Usuario> {
//     return this.http.post<Usuario>(this.apiUrl, usuario);
//   }

//   // 4. PUT: Actualizar un usuario existente
//   actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
//     return this.http.put<Usuario>(`${this.apiUrl}${id}/`, usuario);
//   }

//   // 5. DELETE: Borrar un usuario
//   eliminarUsuario(id: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}${id}/`);
//   }
// }

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private authService = inject(UserAuthService);
  private apiUrl = 'http://127.0.0.1:8000/api/usuarios/';

  // 0. Función ayudante para mostrar la "entrada VIP" (El Token)
  private getHeaders(): HttpHeaders {
    // Busca el token en el almacenamiento del navegador (sessionStorage o localStorage)
    const token = this.authService.getToken(); 
    
    if (token) {
      // IMPORTANTE: Si Django te sigue rebotando, cambiá la palabra 'Token' por 'Bearer'
      return new HttpHeaders({
        'Authorization': `Token ${token}` 
      });
    }
    return new HttpHeaders();
  }

  // 1. GET: Traer la lista completa de usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // 2. GET: Traer un solo usuario por su ID
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  // 3. POST: Crear un usuario nuevo
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario, { headers: this.getHeaders() });
  }

  // 4. PUT: Actualizar un usuario existente
  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}${id}/`, usuario, { headers: this.getHeaders() });
  }

  // 5. DELETE: Borrar un usuario
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}