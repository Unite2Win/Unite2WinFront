import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  constructor(private router:Router, private jwtHelper: JwtHelperService){}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem("access_token");

    if (token && !this.jwtHelper.isTokenExpired(token)){
      console.log('TOKEN VALIDO AUTH GUARD')
      return true;
    }

    this.router.navigate(["authentication/login"]);
    console.log('TOKEN NO VALIDO AUTH GUARD')
    return false;
  }
}