import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockSucursal } from '../models/stock-sucursal.model';

@Injectable({ providedIn: 'root' })
export class StockSucursalService {
  private apiUrl = 'http://localhost:8000/api/stock/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<StockSucursal[]> {
    return this.http.get<StockSucursal[]>(this.apiUrl);
  }

  getById(id: number): Observable<StockSucursal> {
    return this.http.get<StockSucursal>(`${this.apiUrl}${id}/`);
  }

  create(stock: StockSucursal): Observable<StockSucursal> {
    return this.http.post<StockSucursal>(this.apiUrl, stock);
  }

  update(id: number, stock: StockSucursal): Observable<StockSucursal> {
    return this.http.put<StockSucursal>(`${this.apiUrl}${id}/`, stock);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}