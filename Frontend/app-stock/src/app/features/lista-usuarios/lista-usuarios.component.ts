
import { Component, OnInit, inject } from '@angular/core';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { RouterLink } from '@angular/router';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit {
  
  usuarios: Usuario[] = [];
  cargando: boolean = true; // Arranca en true para mostrar un spinner o texto de carga

  private usuarioService = inject(UsuarioService);
  private modalService = inject(ModalService);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false; // Apagamos la carga cuando llegan los datos
      },
      error: (err) => {
        console.error('Error al traer los usuarios de la base de datos:', err);
        this.cargando = false;
      }
    });
  }
  usuarioAEliminar: number | null = null;

  prepararEliminacion(id: number): void {
    this.usuarioAEliminar = id;
  }
   confirmarEliminacion(): void {
    if (this.usuarioAEliminar) {
      this.usuarioService.eliminarUsuario(this.usuarioAEliminar).subscribe({
        next: () => {
          this.modalService.exito('¡Usuario eliminado correctamente!');
          this.cargarUsuarios(); 
          this.usuarioAEliminar = null; // Limpiamos
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          this.modalService.error('Hubo un problema al intentar eliminar el usuario.');
          this.usuarioAEliminar = null;
        }
      });
    }
   }
  }
