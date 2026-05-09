import { Injectable } from '@angular/core';
import { TempUsersService } from './temp-users.service';

@Injectable({
  providedIn: 'root'
})

// Este servicio es completamente inseguro, está acá unicamente para pruebas de frontend. 
// Lo más seguro es que debas realizar la conexión a una base de datos real para sacar los datos que necesites.
// NO UTILIZAR ESTE SERVICIO SI ESTAS DE ACUERDO CON ESTO.
export class UserAuthService {
  private listaUsuarios:any;
  
  constructor(private TempUsersService:TempUsersService) {
    this.listaUsuarios = TempUsersService.obtenerTodos;
  }

  public autenticar(nombre:string, password:string) {
    console.warn("Atención!: Se está utilizando un autenticador inseguro, por lo que deberás cambiarlo antes de llevar a producción este sitio web.");
    for(const user of this.listaUsuarios) {
      if(nombre === user.nombre && password === user.password) {
        return user;
      }
    }
    return null;
  }
}
