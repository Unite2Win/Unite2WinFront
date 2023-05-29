import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { LoginModel } from 'app/usuario/interfaces/loginModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  miFormLogin: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private loginService: LoginService, private toastrService: ToastrService) { }

  async iniciarSesion() {
    if (this.miFormLogin.invalid) {
      this.toastrService.warning('El usuario y la contraseña son obligatorios.')
      return;
    }

    this.loginService.loadingFlag = true;

    let user: LoginModel =
    {
      nick: this.miFormLogin.get('username').value,
      password: this.miFormLogin.get('password').value,
    };

    this.loginService.signIn(user);

    // setTimeout(() => {
    //   if(this.loginService.isLoggedIn){
    //     this.router.navigate(["/"]);
    //     console.log('soy el user:'+this.loginService.AUTH_USERID )
    //   }
    // }, 1000)

  }

  getLoadingFlag() {
    return this.loginService.loadingFlag;
  }

  sesionIniciada() {
    const token = this.loginService.getToken();
    if (token != null) {
      return "/usuario/perfil"
    } else {
      return "/authentication/login"
    }
  }

  mostrar() {
    this.loginService.getUbicacion().subscribe((resp) => {
      console.log(resp);
    });
  }

  logout() {
    this.loginService.logout();
  }

  loginform = true;
  recoverform = false;

  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
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
}
