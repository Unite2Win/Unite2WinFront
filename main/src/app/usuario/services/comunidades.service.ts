import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Comunidad } from '../interfaces/comunidadModel';

@Injectable({
  providedIn: 'root'
})
export class ComunidadesService {
  baseurl = environment.url;
  
  constructor(private http: HttpClient) { }

  GetComunidadesBBDD(): Observable<Comunidad[]> {
    return this.http
      .get<Comunidad[]>(`${this.baseurl}/Comunidades`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //COUNT
  GetComunidadesCount(): Observable<number> {
    return this.http
      .get<number>(`${this.baseurl}/comunidades/count`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //PAGINADO
  GetComunidadesPaginados(pagina: number, pageSize: number): Observable<Comunidad[]> {
    return this.http
      .get<Comunidad[]>(`${this.baseurl}/comunidades/paginado/${pagina}/${pageSize}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  PutComunidadIdBBDD(
    ComunidadId: number,
    language: Comunidad
  ): Observable<Comunidad> {
    return this.http
      .put<Comunidad>(
        `${this.baseurl}/Comunidades/${ComunidadId}`,
        language
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  DeleteComunidadBBDD(
    ComunidadId: number,
    comunidad: Comunidad
  ): Observable<Comunidad> {
    return this.http
      .put<Comunidad>(
        `${this.baseurl}/Comunidades/${ComunidadId}/delete`,
        comunidad
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  PostComunidadBBDD(Comunidad: Comunidad): Observable<Comunidad> {
    return this.http
      .post<Comunidad>(`${this.baseurl}/Comunidades`, Comunidad)
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
