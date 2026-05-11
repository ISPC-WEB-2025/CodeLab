import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sucursal } from '../models/sucursal.model';

@Injectable({ providedIn: 'root' })
export class SucursalService {
  private apiUrl = 'http://localhost:8000/api/sucursales/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(this.apiUrl);
  }

  getById(id: number): Observable<Sucursal> {
    return this.http.get<Sucursal>(`${this.apiUrl}${id}/`);
  }

  create(sucursal: Sucursal): Observable<Sucursal> {
    return this.http.post<Sucursal>(this.apiUrl, sucursal);
  }

  update(id: number, sucursal: Sucursal): Observable<Sucursal> {
    return this.http.put<Sucursal>(`${this.apiUrl}${id}/`, sucursal);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}