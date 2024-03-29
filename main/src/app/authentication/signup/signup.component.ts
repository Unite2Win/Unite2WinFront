import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from './signup.service';
import { Usuario } from 'app/usuario/interfaces/usuarioModel';
import { ToastrService } from 'ngx-toastr';
import { ComunidadesUsuariosService } from 'app/usuario/services/comunidades-usuarios.service';
import { UsuariosService } from 'app/usuario/services/usuarios.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {

  miFormSignUp: FormGroup = this.fb.group({
    name: ['', Validators.required],
    surname: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    passRepeat: ['', Validators.required]
  });

  constructor(private usuariosService: UsuariosService, private toastrService: ToastrService, private fb: FormBuilder, private signupService: SignupService, private router: Router) {}

  async signup() {
    if (this.miFormSignUp.get("password").value != this.miFormSignUp.get("passRepeat").value) {
      this.miFormSignUp.setErrors({ 'invalid': true });
      console.log('Contraseñas no coinciden');
      this.toastrService.error('Las contraseñas no coinciden');
      return;
    }
    if (this.miFormSignUp.invalid) {
      this.toastrService.error('El formulario no es válido');
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

    let flag: boolean;

    await this.usuariosService.GetComunidadesUsuariosIsRepeatedNick(usuario.nick).toPromise().then(resp => {
      flag = resp;
    })

    if (flag) {
      this.toastrService.error('Usuario ya en uso, pruebe otro');
      return;
    }

    if (usuario.password.length < 8) {
      this.toastrService.error('La contraseña debe tener mas de 8 caracteres');
      return;
    }

    if (usuario.password.length > 50) {
      this.toastrService.error('La contraseña debe tener menos de 50 caracteres');
      return;
    }

    await this.signupService.registroU2W(usuario);
    this.router.navigate(["authentication/login"]);
  }

  password = "password";

  show = false;

  onClick() {
    if (this.password == 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  password2 = "password";

  show2 = false;

  onClick2() {
    if (this.password2 == 'password') {
      this.password2 = 'text';
      this.show2 = true;
    } else {
      this.password2 = 'password';
      this.show2 = false;
    }
  }

}
