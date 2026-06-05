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
    dni: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    email: ['', [Validators.required, Validators.email]],
    fecha_nacimiento: ['', Validators.required], 
    password: ['', Validators.required],         
    rol: ['', Validators.required]
  });


  guardarUsuario() {
    if (this.usuarioForm.valid) {
      // 2. Hacemos una copia de los datos del formulario
      const datosParaEnviar = { ...this.usuarioForm.value };
      
      // 3. Convertimos el rol (que viene como texto del HTML) a un Número
      datosParaEnviar.rol = Number(datosParaEnviar.rol);

      // 4. Mandamos la copia corregida al servicio
      this.usuarioService.crearUsuario(datosParaEnviar).subscribe({
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
      this.usuarioForm.markAllAsTouched();
    }
  }
}

