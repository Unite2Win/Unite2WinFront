import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Evento } from '../interfaces/eventoModel';
import { Comunidad } from '../interfaces/comunidadModel';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  baseurl = environment.url;

  constructor(private http: HttpClient) { }

  GetEventosBBDD(): Observable<Evento[]> {
    return this.http
      .get<Evento[]>(`${this.baseurl}/Eventos`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetEventoById(eventoId: number): Observable<Evento> {
    return this.http
      .get<Evento>(`${this.baseurl}/Eventos/${eventoId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetProximosXDias(numDias: number, comunidadId: number): Observable<Evento[]> {
    return this.http
      .get<Evento[]>(`${this.baseurl}/eventos/proximosXdias/porComunidad/${numDias}/${comunidadId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetEventosEnCurso(comunidadId: number): Observable<Evento[]> {
    return this.http
      .get<Evento[]>(`${this.baseurl}/eventos/enCurso/porComunidad/${comunidadId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetEventosPorComunidad(comunidadId: number): Observable<Evento[]> {
    return this.http
      .get<Evento[]>(`${this.baseurl}/Eventos/${comunidadId}/comunidadId/`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //COUNTCOMUNIDAD
  GetEventosCountPorComunidad(comunidadId: number): Observable<number> {
    return this.http
      .get<number>(`${this.baseurl}/eventos/count/comunidadId/${comunidadId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //COUNT
  GetEventosCount(): Observable<number> {
    return this.http
      .get<number>(`${this.baseurl}/eventos/count`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //PAGINADO
  GetEventosPaginados(pagina: number, pageSize: number): Observable<Evento[]> {
    return this.http
      .get<Evento[]>(`${this.baseurl}/eventos/paginado/${pagina}/${pageSize}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  PutEventoIdBBDD(
    EventoId: number,
    evento: Evento
  ): Observable<Evento> {
    return this.http
      .put<Evento>(
        `${this.baseurl}/Eventos/${EventoId}`,
        evento
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  DeleteEventoBBDD(
    EventoId: number,
    evento: Evento
  ): Observable<Evento> {
    return this.http
      .put<Evento>(
        `${this.baseurl}/Eventos/${EventoId}/delete`,
        evento
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  PostEventoBBDD(Evento: Evento): Observable<Evento> {
    return this.http
      .post<Evento>(`${this.baseurl}/Eventos`, Evento)
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
