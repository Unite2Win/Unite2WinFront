import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuariosService } from 'app/usuario/services/usuarios.service';
import { globales } from 'common/globales';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  constructor(private router:Router, private jwtHelper: JwtHelperService, private usuariosService: UsuariosService){}
  
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem("access_token");

    if (token && !this.jwtHelper.isTokenExpired(token)){
      // Aquí miro si está logueado y recojo la info de usuario, he hecho que la función sea asíncrona,
      // ya que a veces si refrescaba en perfil, el propio componente cargaba antes de que la 
      // promesa estuviera resuelta.
      const usuarioId = localStorage.getItem('user_id')
      var usuarioModel = this.usuariosService.getUsuarioById(Number(usuarioId)).toPromise()
      await usuarioModel.then(resp => {
        globales.usuarioLogueado = resp;
        console.log(globales.usuarioLogueado)
      })
      //
      console.log('TOKEN VALIDO AUTH GUARD')
      return true;
    }

    this.router.navigate(["authentication/login"]);
    console.log('TOKEN NO VALIDO AUTH GUARD')
    return false;
  }
}