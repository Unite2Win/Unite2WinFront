import { HttpClient } from '@angular/common/http';
import { Injectable, Component } from '@angular/core';
import { Observable} from 'rxjs';
import { Objetivo } from '../interfaces/objetivo';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { globales } from 'common/globales';
import { Usuario } from '../interfaces/usuarioModel';
import { ObjetivosComponent } from '../objetivos/objetivos.component';

@Injectable({
  providedIn: 'root'
})
export class ObjetivosService {

  private API_URL = 'https://localhost:7059/api/Objetivos';

  public objetivosBd: Objetivo[] = [];

  public usuario: number = globales.usuarioLogueado.id_usu

  constructor(private http: HttpClient) { }

  async getObjetivos() {
  await this.GetObjetivosUsuario(this.usuario).toPromise().then(res => this.objetivosBd = res);
  }
  // async getObjetivos() {
  // await this.GetObjetivosBBDD().toPromise().then(res => {
  //     this.objetivosBd = res.filter(objetivo => objetivo.delete_date == null);
  //   });
  // }
  // Lo suyo es no trerse todos los elementos sino filtrar en el back los que no tengan
  // a null el delete_date y no del array que hemos llenado previamente con todos.
  // El metodo anterior (getObjetivos()) es provisional
  GetObjetivosBBDD(){
    return this.http.get<Objetivo[]>(this.API_URL);
  }
  
  GetObjetivosUsuario(id: number){
    const url = `${this.API_URL}/${id}/usuarioId`;
    return this.http.get<Objetivo[]>(url);
  }

  PostObjetivos(objetivo:Objetivo):Observable<any>{
    //console.log("anadir objetivos disparado");
    //console.log(objetivo.toString());
    return this.http.post<Objetivo>(`${this.API_URL}/API/post`,objetivo);
  }

  PutObjetivos(objetivo:Objetivo):Observable<any>{
    return this.http.post<Objetivo>(`${this.API_URL}/API/put`,objetivo);
  }

  DeleteObjetivos(id: number): Observable<Object>{
    //console.log("eliminar objetivos disparado");
     return this.http.put(`${this.API_URL}/delete`,id);
  }

  UpdateObjetivos(id: number, objetivoActualizado: Objetivo): Observable<Objetivo> {
    const url = `${this.API_URL}/${id}`;
    return this.http.put<Objetivo>(url, objetivoActualizado);
  }
  
  //ENEKO

  // url = environment.url

  // constructor(private http: HttpClient) { }

  // public getAll(): Observable<Objetivo[]> {
  //   return this.http.get<Objetivo[]>(`${this.url}/Objetivos`);
  // }

  // public getById(id: number): Observable<Objetivo[]> {
  //   return this.http.get<Objetivo[]>(`${this.url}/Objetivos/usuario/${id}`);
  // }

  // public postObjetivo(objetivo: Objetivo): Observable<Objetivo> {
  //   return this.http.post<Objetivo>(`${this.url}/Objetivos`, objetivo);
  // }
}
