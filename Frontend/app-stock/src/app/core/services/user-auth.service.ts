import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserAuthService {
  private apiUrl = 'http://localhost:8000/api/usuarios/login/';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('es_admin', response.es_admin.toString());
          localStorage.setItem('es_empleado', response.es_empleado.toString());
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); 
  }

  isAdmin(): boolean {
    return localStorage.getItem('es_admin') === 'true';
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('es_admin');
    localStorage.removeItem('es_empleado');
  }
}
