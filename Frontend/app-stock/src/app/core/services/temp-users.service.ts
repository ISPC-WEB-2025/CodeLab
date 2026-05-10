import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// SERVICIO TEMPORAL, REEMPLAZAR ESTO CON CONSULTAS ATRAVES DE API'S RESTFUL A UNA BDD
export class TempUsersService {
  private listaUsuarios:{}[] = [
    {id : 1, nombre : "John Administrador", email: "johnadmin26@email.com", role: "Administrador", password: "123456789"},
    {id : 2, nombre : "Jane Vendedora", email: "jane_seller@email.com", role: "Vendedor", password: "987654321"}
  ];

  get obtenerTodos() {
    return this.listaUsuarios;
  }
}
