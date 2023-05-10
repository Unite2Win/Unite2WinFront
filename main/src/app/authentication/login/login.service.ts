import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticatedResponse } from '../../usuario/interfaces/authenticatedResponseModel';
import { UsuariosService } from '../../usuario/services/usuarios.service';
import { globales } from 'common/globales';
import { Usuario } from 'app/usuario/interfaces/usuarioModel';
import { LoginModel } from 'app/usuario/interfaces/loginModel';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  endpoint: string = environment.url;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser: Usuario;

  public AUTH_TOKEN: string = this.getToken();
  public AUTH_USERID: string = this.getId();



  constructor(private http: HttpClient, public router: Router, private jwtHelper: JwtHelperService, private usuariosService: UsuariosService) { }

  signIn(user: LoginModel) {
    this.logout();
    return this.http
      .post<AuthenticatedResponse>(`${this.endpoint}/seguridad`, user, {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      })
      .subscribe({
        next: (response: AuthenticatedResponse) => {
          //Aquí recojo la inormación del usuario y la guardo en common
          var usuarioModel = this.usuariosService.getUsuarioById(Number(response.user_ID)).toPromise()
          usuarioModel.then(resp => {
            globales.usuarioLogueado = resp;
            console.log(globales.usuarioLogueado);
            this.currentUser = resp;
          })
          //
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('user_id', response.user_ID);
          this.AUTH_TOKEN = this.getToken();
          this.AUTH_USERID = this.getId();
          this.router.navigate(["/usuario/perfil"]);
        },
      })
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    this.AUTH_TOKEN = '';
    this.AUTH_USERID = '';
  }

  getUbicacion() {
    return this.http.get<any>(`${this.endpoint}/ubicaciones`)
  }

  getToken() {
    if (localStorage.getItem('access_token') != null) {
      return localStorage.getItem('access_token');
    } else {
      return '';
    }
  }

  getId() {
    if (localStorage.getItem('user_id') != null) {
      return localStorage.getItem('user_id');
    } else {
      return '';
    }
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    if (authToken && !this.jwtHelper.isTokenExpired(authToken)) {
      return true;
    }
    return false;
  }

  // User profile
  getUserProfile(id: any): Observable<any> {
    const api = `${this.endpoint}/user-profile/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
