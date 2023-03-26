import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from 'app/interfaces/usuarioModel';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  baseurl = environment.url;

  constructor(private http: HttpClient) { }

  RegistroUsuarioBBDD(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.baseurl}/Usuarios`, usuario)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  async registroU2W(usuario: Usuario) {
    await this.RegistroUsuarioBBDD(usuario).toPromise().then(resp => console.log(resp));
  }

  // ERROR HANDLER
  errorHandl(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
