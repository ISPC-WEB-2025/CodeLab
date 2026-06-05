import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-form-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-usuarios.component.html',
  styleUrl: './form-usuarios.component.css',
})
export class FormUsuariosComponent implements OnInit {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private modalService = inject(ModalService);
  private route = inject(ActivatedRoute); // Inyectamos el espía de URLs

  // Variables para controlar la pantalla
  esEdicion = false;
  usuarioId: number | null = null;

  // Formulario (ya sin el campo apellido, queda solo nombre)
  usuarioForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    email: ['', [Validators.required, Validators.email]],
    fecha_nacimiento: ['', Validators.required], 
    password: ['', Validators.required],         
    rol: ['', Validators.required]
  });

ngOnInit() {
    // Escuchamos la URL para saber si es /nuevo o /editar/:id
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.esEdicion = true;
        // 1. Convertimos el ID de la URL (que viene como texto) a Número
        this.usuarioId = Number(params['id']);
        
        // 2. Le agregamos el ! para jurarle a TS que no es nulo
        this.cargarUsuario(this.usuarioId!); 
      }
    });
  }
  cargarUsuario(id: number) {
    this.usuarioService.getUsuario(id).subscribe({
      next: (usuario) => {
        // Rellenamos el form con los datos que vienen de Django
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          dni: usuario.dni,
          email: usuario.email,
          fecha_nacimiento: usuario.fecha_nacimiento,
          rol: usuario.rol
        });
      },
      error: (err) => {
        console.error('Error al traer usuario', err);
        this.modalService.error('Error al cargar los datos del usuario.');
      }
    });
  }

  guardarUsuario() {
    if (this.usuarioForm.valid) {
      const datosForm = this.usuarioForm.value;
      
      // Preparamos los datos empaquetados para el backend
      const datosParaEnviar: any = {
        nombre: datosForm.nombre,
        dni: datosForm.dni,
        email: datosForm.email,
        fecha_nacimiento: datosForm.fecha_nacimiento,
        rol: Number(datosForm.rol),
        password: datosForm.password
      };


      if (this.esEdicion && this.usuarioId) {
        // MODO EDICIÓN (PUT)
        this.usuarioService.actualizarUsuario(this.usuarioId, datosParaEnviar).subscribe({
          next: () => {
            this.modalService.exito('¡Usuario actualizado con éxito!');
            this.router.navigate(['/dashboard/lista-usuarios']);
          },
          error: (err) => {
            console.error('Error al actualizar usuario', err);
            this.modalService.error('Hubo un error al actualizar los datos.');
          }
        });
      } else {
        // MODO CREACIÓN (POST)
        this.usuarioService.crearUsuario(datosParaEnviar).subscribe({
          next: () => {
            this.modalService.exito('¡Usuario creado con éxito!');
            this.router.navigate(['/dashboard/lista-usuarios']);
          },
          error: (err) => {
            console.error('Error al crear usuario', err);
            this.modalService.error('Hubo un error al comunicarse con el servidor.');
          }
        });
      }
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }
}