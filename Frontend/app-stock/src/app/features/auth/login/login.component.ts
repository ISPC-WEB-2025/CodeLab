import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Texto localizable 
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
    })
  }

  onEnviar(_:Event) {
    console.log(this.loginForm.value)
  }
}
