import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from './signup.service';
import { Usuario } from 'app/usuario/interfaces/usuarioModel';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {

  miFormSignUp: FormGroup = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    passRepeat: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private signupService: SignupService, private router: Router) {}

  async signup() {
    if (this.miFormSignUp.get("password").value != this.miFormSignUp.get("passRepeat").value) {
      this.miFormSignUp.setErrors({ 'invalid': true });
      console.log('Contraseñas no coinciden');
      return;
    }
    if (this.miFormSignUp.invalid) {
      console.log('Formulario no válido');
      return;
    }
    var usuario: Usuario = {
      id_usu: 0,
      nick: this.miFormSignUp.get("username").value,
      password: this.miFormSignUp.get("password").value,
      name: this.miFormSignUp.get("name").value,
      surname: this.miFormSignUp.get("surname").value,
      email: this.miFormSignUp.get("email").value,
      level: 1,
      active: true,
      picture: null,
      last_login: null,
      create_date: "2023-03-26",
      last_modified: null,
      delete_date: null,
      perfil: null,
      objetivos: null,
      comunidadesUsuarios: null
    }
    await this.signupService.registroU2W(usuario);
    this.router.navigate(["authentication/login"]);
  }

}
