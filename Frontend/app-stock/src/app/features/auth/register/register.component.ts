import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { validadorPassword } from './register.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  // Texto localizable 
  // TODO(TMF): AGREGAR MAS STRINGS QUE SE PUEDAN LOCALIZAR/SEAN TRADUCIBLES
  readonly creaTuCuenta: string = "¡Creá tu cuenta!";

  readonly registroError: string = "Hay campos que son inválidos. ¡Por favor revisalos antes de enviar el formulario!";
  readonly errorDesconocido: string = "Error desconocido.";
  readonly nombreVacio: string = "Ingresá un nombre de usuario con 6 o más caracteres.";
  readonly emailVacio: string = "Ingresá un correo electrónico.";
  readonly emailInvalido: string = "Los datos para el correo electrónico no son válidos.";
  readonly passwordVacio: string = "Ingresá una contraseña.";
  readonly passwordCorto: string = "La contraseña tiene que tener 8 o más caracteres.";
  readonly passwordNoCoincide: string = "Las contraseñas no coinciden.";
  // URI de imagenes
  readonly imagenURI: string = "assets/deposito.png";
  readonly cajaURI: string = "assets/ToDoLogosf.png";
  // Registro de formularios
  registerForm!: FormGroup;
  registerErrored: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      nombre:["", [Validators.required, Validators.minLength(6)], []],
      email:["", [Validators.required, Validators.email], []],
      password:["", [Validators.required, Validators.minLength(8)], []],
      confirm_password:["", [Validators.required, Validators.minLength(8)], []],
    }, {
      validators: [validadorPassword("password", "confirm_password")]
    });
  }

  // Getters
  get nombre () {
    return this.registerForm.get("nombre");
  }

  get email () {
    return this.registerForm.get("email");
  }

  get password () {
    return this.registerForm.get("password");
  }

  get c_password () {
    return this.registerForm.get("confirm_password");
  }

  // Manejo de formulario
  public onEnviar(event:Event) {
    event.preventDefault(); // Previene que el navegador haga su trabajo por defecto, ahora lo manejamos desde acá

    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      const nombre = registerData.nombre;
      const email = registerData.email;

      this.registerErrored = false;
      alert(`Usuario registrado! Nombre: ${nombre}, email: ${email}`);
    }
    else {
      this.registerErrored = true;
      this.registerForm.markAllAsTouched();
    }
  }
}
