import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UserAuthService {
  private loginURL = 'http://localhost:8000/api/usuarios/login/';
  private registroURL = 'http://localhost:8000/api/usuarios/registro/'; 

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginURL, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('nombre_usuario', response.nombre);
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('es_admin', response.es_admin.toString());
          localStorage.setItem('es_empleado', response.es_empleado.toString());
          localStorage.setItem('login_timestamp', Date.now().toString());
        }
      })
    );
  }

  // TODO: ¿Esta bien que Fecha De Nacimiento(fdn) sea de tipo any? Averiguar de que tipo se necesita
  registrar(nombre: string, email: string, dni: number, fdn: any, password: string): Observable<any> {
    return this.http.post<any>(this.registroURL, {
      nombre, 
      email, 
      dni, 
      fdn, 
      password
    }).pipe(
      tap(response => {
        console.log('Usuario registrado con exito.', response);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUsername(): string | null {
    return localStorage.getItem('nombre_usuario');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const loginTimestamp = localStorage.getItem('login_timestamp');
    if (loginTimestamp) {
      const now = Date.now();
      const expirationMs = 5 * 24 * 60 * 60 * 1000; // 5 días en milisegundos
      if (now - parseInt(loginTimestamp, 10) > expirationMs) {
        this.logout();
        return false;
      }
    }
    
    return true; 
  }

  isAdmin(): boolean {
    return localStorage.getItem('es_admin') === 'true';
  }

  logout(): void {
    localStorage.clear(); // Borramos los datos de sesion y localStorage
    sessionStorage.clear();

    // Recargamos la pagina y redirigimos al login, tambien para evitar problemas a priori
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); 
    });
  }
}
