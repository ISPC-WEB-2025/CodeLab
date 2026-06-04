
import { Component, OnInit, inject } from '@angular/core';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { RouterLink } from '@angular/router';

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
}
