import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { Usuario } from '../interfaces/usuarioModel';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  url = environment.url

  constructor(private http: HttpClient) { }

  GetUsuariosBBDD(): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${this.url}/Usuarios`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetUsuariosByIdArray(arrayId: number[]): Observable<Usuario[]> {
    return this.http
      .post<Usuario[]>(`${this.url}/Usuarios/usuarios/getbyid/array`, arrayId)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetByNick(nick: string): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${this.url}/Usuarios/usuarios/getby/nick/${nick}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetComunidadesUsuariosIsRepeatedNick(nick: string): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.url}/Usuarios/usuarios/check/repeatedNick/${nick}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  public getUsuarioById(idUsuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/Usuarios/${idUsuario}`);
  }

  public putUsuario(idUsuario: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/Usuarios/${idUsuario}`, usuario);
  }

  // ERROR HANDLER
  errorHandl(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }
}
