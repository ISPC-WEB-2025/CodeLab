import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from './toast.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

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

  async confirmar(mensaje: string): Promise<boolean> {
    const modalRef = this.ngbModal.open(ConfirmModalComponent);
    modalRef.componentInstance.mensaje = mensaje;
    try {
      await modalRef.result;
      return true;
    } catch {
      return false;
    }
  }
}