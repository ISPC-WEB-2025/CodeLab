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
  readonly mensajeBienvenida: string = "¡Bienvenido a ToDo Stock!";
  
  readonly emailInvalido: string = "Por favor ingresá tu correo electrónico";
  readonly passwordNoExiste: string = "Por favor ingresá  tu contraseña";
  readonly passwordInvalido: string = "La contraseña tiene que tener 8 o más caracteres";
  readonly datosIncorrectos: string = "El nombre o contraseña ingresados son incorrectos";
  // URI de imagenes
  readonly imagenURI: string = "assets/deposito.png";
  // LoginForms, para detectar datos cuando se clickea el boton de iniciar sesion, y su estado
  public loginForm!: FormGroup;
  public loginError: Boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email:["", [Validators.required, Validators.email], []],
      password:["", [Validators.required, Validators.minLength(8)], []],
      recordar:["", []],
    });
  }

  // Getters para que el template pueda ver nuestros datos
  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  get loginErrored():Boolean {
    return this.loginError;
  }

  // Inyeccion de servicio
  private auth = inject(UserAuthService);

  public onEnviar(event: Event) {
    event.preventDefault(); // Previene que el navegador haga su trabajo por defecto, ahora lo manejamos desde acá

    // Procedemos si todos los datos del formulario estan llenados y son válidos antes de contactar con el backend
    if(this.loginForm.valid) {
      const loginData = this.loginForm;
      const email = loginData.value.email;
      const password = loginData.value.password;

      // Función autenticadora
      const usuario = this.auth.autenticar(email, password);

      // Logeado con éxito, lo mostramos con un alert por el momento
      if(usuario) {
        this.loginError = false;
        alert(`¡Bienvenido ${usuario.nombre}@rol:${usuario.role}, fuiste logeado con exito!`);
      }
      // Fallo en login, se muestra un mensaje en rojo en el template
      else {
        this.loginError = true;
      }
    }
    // Fallo en login, al menos un campo tiene errores. Lo mostramos al marcar a todos los campos como tocados
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
