import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../../../core/services/user-auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UserAuthService],
})

export class LoginComponent {
  // Texto localizable 
  // TODO(TMF): AGREGAR MAS STRINGS QUE SE PUEDAN LOCALIZAR/SEAN TRADUCIBLES
  mensajeBienvenida:string = "¡Bienvenido a ToDo Stock!";
  // URI de imagenes
  imagenURI:string = "assets/deposito.png";
  // LoginForms, para detectar datos cuando se clickea el boton de iniciar sesion
  loginForm!:FormGroup;

  constructor(private formBuilder:FormBuilder) {
    this.loginForm = this.formBuilder.group({
      nombre:["", []],
      password:["", []],
      recordar:["", []],
    });
  }

  // Inyeccion de servicio
  private auth = inject(UserAuthService);

  public onEnviar(_:Event) {
    const loginData = this.loginForm;
    const nombre = loginData.value.nombre;
    const password = loginData.value.password;

    const usuario = this.auth.autenticar(nombre, password);

    if(usuario){
      alert("Fuiste logeado con exito!");
    }
  }
}
