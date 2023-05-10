import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuarioModel';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  url = environment.url

  constructor(private http: HttpClient) { }

  public getUsuarioById(idUsuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/Usuarios/${idUsuario}`);
  }

  public putUsuario(idUsuario: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/Usuarios/${idUsuario}`, usuario);
  }
}
