import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  readonly mensajeBienvenida:string = "¡Bienvenido a ToDo Stock!";
  readonly nombreInvalido:string = "Por favor ingresa tu nombre de usuario";
  readonly passwordNoExiste:string = "Por favor ingresa tu contraseña";
  readonly passwordInvalido:string = "La contraseña tiene que tener 8 o más caracteres";
  // URI de imagenes
  readonly imagenURI:string = "assets/deposito.png";
  // LoginForms, para detectar datos cuando se clickea el boton de iniciar sesion
  loginForm!:FormGroup;

  constructor(private formBuilder:FormBuilder) {
    this.loginForm = this.formBuilder.group({
      nombre:["", [Validators.required], []],
      password:["", [Validators.required, Validators.minLength(8)], []],
      recordar:["", []],
    });
  }

  get nombre() {
    return this.loginForm.get("nombre");
  }

  get password() {
    return this.loginForm.get("password");
  }

  // Inyeccion de servicio
  private auth = inject(UserAuthService);

  public onEnviar(event:Event) {
    event.preventDefault(); // Previene que el navegador haga su trabajo por defecto, ahora lo manejamos desde aqui.

    // Procedemos si todos los datos del formulario estan llenados y son validos antes de contactar con el backend.
    if(this.loginForm.valid) {
      const loginData = this.loginForm;
      const nombre = loginData.value.nombre;
      const password = loginData.value.password;

      // Función autenticadora
      const usuario = this.auth.autenticar(nombre, password);

      if(usuario){
        alert("Fuiste logeado con exito!");
      }
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
