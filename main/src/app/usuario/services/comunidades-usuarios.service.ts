import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Usuario } from '../interfaces/usuarioModel';
import { ComunidadUsuario } from '../interfaces/comunidadUsuarioModel';

@Injectable({
  providedIn: 'root'
})
export class ComunidadesUsuariosService {
  baseurl = environment.url;
  
  constructor(private http: HttpClient) { }

  //COUNT
  GetComunidadesUsuariosCountByComunidad(comunidadId: number): Observable<number> {
    return this.http
      .get<number>(`${this.baseurl}/comunidadUsuario/count/comunidad/${comunidadId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetComunidadesUsuariosByUsuario(usuarioId: number): Observable<ComunidadUsuario> {
    return this.http
      .get<ComunidadUsuario>(`${this.baseurl}/ComunidadesUsuarios/comunidadUsuario/usuario/${usuarioId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetComunidadesUsuariosByComunidad(comunidadId: number): Observable<ComunidadUsuario[]> {
    return this.http
      .get<ComunidadUsuario[]>(`${this.baseurl}/ComunidadesUsuarios/comunidadUsuario/comunidad/${comunidadId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetComunidadesUsuariosByUsuarioYComunidad(usuarioId: number, comunidadId: number): Observable<ComunidadUsuario> {
    return this.http
      .get<ComunidadUsuario>(`${this.baseurl}/comunidadUsuario/${comunidadId}/${usuarioId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetComunidadesUsuariosIsMember(usuarioId: number, comunidadId: number): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.baseurl}/comunidadUsuario/count/ismiembro/${comunidadId}/${usuarioId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  DeleteComunidadBBDD(
    comunidadUsuarioId: number,
    comunidadUsuario: ComunidadUsuario
  ): Observable<ComunidadUsuario> {
    return this.http
      .put<ComunidadUsuario>(
        `${this.baseurl}/ComunidadesUsuarios/${comunidadUsuarioId}/delete`,
        comunidadUsuario
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  PostComunidadBBDD(ComunidadUsuario: ComunidadUsuario): Observable<ComunidadUsuario> {
    return this.http
      .post<ComunidadUsuario>(`${this.baseurl}/ComunidadesUsuarios`, ComunidadUsuario)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //
  GetComunidadesUsuariosCount(usuarioId: number): Observable<number> {
    return this.http
      .get<number>(`${this.baseurl}/comunidadUsuario/count/${usuarioId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetComunidadesUsuariosPaginado(pagina: number, pageSize: number, usuarioId: number): Observable<ComunidadUsuario[]> {
    return this.http
      .get<ComunidadUsuario[]>(`${this.baseurl}/comunidadUsuario/paginado/${pagina}/${pageSize}/${usuarioId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetComunidadesUsuariosPaginadoExplorar(pagina: number, pageSize: number, usuarioId: number): Observable<ComunidadUsuario[]> {
    return this.http
      .get<ComunidadUsuario[]>(`${this.baseurl}/comunidadUsuarioExplorar/paginado/${pagina}/${pageSize}/${usuarioId}`)
      .pipe(retry(1), catchError(this.errorHandl));
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
