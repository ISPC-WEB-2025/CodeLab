import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StockSucursal } from '../../../core/models/stock-sucursal.model';
import { MovimientoService } from '../../../core/services/movimiento.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-modal-merma',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-merma.component.html',
  styleUrls: ['./modal-merma.component.css']
})
export class ModalMermaComponent implements OnChanges {
  @Input() registroStock: StockSucursal | null = null;
  @Input() mostrar: boolean = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() mermaRegistrada = new EventEmitter<void>();

  formMerma!: FormGroup;
  guardando: boolean = false;
  erroresBackend: any = null;

  motivosPredefinidos: string[] = [
    'Rotura en depósito',
    'Vencimiento de producto',
    'Descarte por falla de fábrica',
    'Pérdida / Extravío',
    'Daño durante transporte',
    'Otro (especificar)'
  ];

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private modalService: ModalService
  ) {
    this.initForm();
  }

  initForm(): void {
    this.formMerma = this.fb.group({
      cantidad: [1, [Validators.required, Validators.min(1)]],
      motivo: ['Rotura en depósito', [Validators.required]],
      motivoPersonalizado: [''],
      observaciones: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registroStock'] && this.registroStock) {
      this.initForm();
      const maxStock = this.registroStock.cantidad_stock;
      this.formMerma.get('cantidad')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(maxStock > 0 ? maxStock : 1)
      ]);
      this.formMerma.get('cantidad')?.updateValueAndValidity();
      this.erroresBackend = null;
    }
  }

  esOtroMotivo(): boolean {
    return this.formMerma.get('motivo')?.value === 'Otro (especificar)';
  }

  cerrarModal(): void {
    if (this.guardando) return;
    this.cerrar.emit();
  }

  confirmarBaja(): void {
    if (this.formMerma.invalid || !this.registroStock) {
      this.formMerma.markAllAsTouched();
      return;
    }

    if (this.registroStock.cantidad_stock <= 0) {
      this.modalService.error('No hay stock disponible para dar de baja.');
      return;
    }

    const cantidad = Number(this.formMerma.value.cantidad);
    if (cantidad > this.registroStock.cantidad_stock) {
      this.modalService.error('La cantidad a dar de baja no puede superar el stock físico disponible.');
      return;
    }

    this.guardando = true;
    this.erroresBackend = null;

    const motivoSeleccionado = this.formMerma.value.motivo;
    const motivoTexto = motivoSeleccionado === 'Otro (especificar)'
      ? `Merma: ${this.formMerma.value.motivoPersonalizado || 'Sin motivo detallado'}`
      : `Merma: ${motivoSeleccionado}`;

    const motivoCompleto = this.formMerma.value.observaciones?.trim()
      ? `${motivoTexto} - Obs: ${this.formMerma.value.observaciones.trim()}`
      : motivoTexto;

    const movimientoPayload: any = {
      tipo: 'Salida',
      cantidad: cantidad,
      id_art: this.registroStock.id_art,
      id_suc: this.registroStock.id_suc,
      motivo: motivoCompleto
    };

    this.movimientoService.create(movimientoPayload).subscribe({
      next: () => {
        this.guardando = false;
        this.modalService.exito(`Se registró correctamente la baja de ${cantidad} unidad(es) por merma.`);
        this.mermaRegistrada.emit();
        this.cerrarModal();
      },
      error: (err) => {
        this.guardando = false;
        if (err.error && err.error.error) {
          this.modalService.error(err.error.error);
        } else {
          this.modalService.error('Error al registrar la baja por merma.');
        }
      }
    });
  }
}
