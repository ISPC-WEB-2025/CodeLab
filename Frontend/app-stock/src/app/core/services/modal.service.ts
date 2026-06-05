import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private ngbModal: NgbModal,
    private toastService: ToastService
  ) { }

  exito(mensaje: string): void {
    this.toastService.show(mensaje, 'success');
  }

  error(mensaje: string): void {
    this.toastService.show(mensaje, 'danger');
  }

  confirmar(mensaje: string): Promise<boolean> {
    return Promise.resolve(confirm(mensaje));
  }
}