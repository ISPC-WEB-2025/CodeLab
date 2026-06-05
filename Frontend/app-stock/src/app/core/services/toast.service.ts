import { Injectable } from '@angular/core';

export interface Toast {
  mensaje: string;
  tipo: 'success' | 'danger' | 'warning';
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  show(mensaje: string, tipo: 'success' | 'danger' | 'warning' = 'success', delay = 3000): void {
    this.toasts.push({ mensaje, tipo, delay });
  }

  remove(toast: Toast): void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear(): void {
    this.toasts = [];
  }
}