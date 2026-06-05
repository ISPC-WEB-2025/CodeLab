import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-form-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-usuarios.component.html',
  styleUrl: './form-usuarios.component.css',
})

export class FormUsuariosComponent {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private modalService = inject(ModalService);

  usuarioForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Solo números
    email: ['', [Validators.required, Validators.email]],
    rol: ['', Validators.required]
  });

  guardarUsuario() {
    // Si el formulario está perfecto se manda al backend
    if (this.usuarioForm.valid) {
      this.usuarioService.crearUsuario(this.usuarioForm.value).subscribe({
        next: () => {
          this.modalService.exito('¡Usuario creado con éxito!');
          // Volvemos a la tabla automáticamente
          this.router.navigate(['/dashboard/lista-usuarios']);
        },
        error: (err) => {
          console.error('Error al crear usuario', err);
          this.modalService.error('Hubo un error al comunicarse con el servidor.');
        }
      });
    } else {
      // Si intentan guardar con campos vacíos, los marcamos todos en rojo
      this.usuarioForm.markAllAsTouched();
    }
  }
}

