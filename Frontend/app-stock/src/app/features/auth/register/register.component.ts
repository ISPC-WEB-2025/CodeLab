import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  creaTuCuenta:string = "¡Create tu cuenta y llenate de sorpresas!";
  // URI de imagenes
  imagenURI:string = "assets/deposito.png";
  cajaURI:string = "assets/ToDoLogosf.png";
  // Registro de formularios
  registerForm!:FormGroup;

  constructor(private formBuilder:FormBuilder) {
    this.registerForm = this.formBuilder.group({
      nombre:["", []],
      email:["", []],
      password:["", []],
      confirm_password:["", []],
    });
  }

  onEnviar(event:Event) {
    console.log(this.registerForm.value);
  }
}
