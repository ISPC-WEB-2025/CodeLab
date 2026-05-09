import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// SERVICIO TEMPORAL, REEMPLAZAR ESTO CON CONSULTAS ATRAVES DE API'S RESTFUL A UNA BDD
export class TempUsersService {
  private listaUsuarios:{}[] = [
    {id : 1, nombre : "John Administrador", role: "Administrador", password: "123456789"},
    {id : 2, nombre : "Jane Vendedora", role: "Vendedor", password: "987654321"}
  ];

  get obtenerTodos() {
    return this.listaUsuarios;
  }
}
