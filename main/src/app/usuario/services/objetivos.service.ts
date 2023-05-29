import { HttpClient } from '@angular/common/http';
import { Injectable, Component } from '@angular/core';
import { Observable} from 'rxjs';
import { Objetivo } from '../interfaces/objetivo';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { globales } from 'common/globales';
import { Usuario } from '../interfaces/usuarioModel';
import { ObjetivosComponent } from '../objetivos/objetivos.component';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObjetivosService {

  public objetivosBd: Objetivo[] = [];

  public usuario: number = globales.usuarioLogueado.id_usu

  baseurl = environment.url;

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
    return this.http.get<Objetivo[]>(`${this.baseurl}/Objetivos`);
  }
  
  GetObjetivosUsuario(id: number){
    return this.http.get<Objetivo[]>(`${this.baseurl}/Objetivos/${id}/usuarioId`);
  }

  PostObjetivos(objetivo:Objetivo):Observable<any>{
    return this.http.post<Objetivo>(`${this.baseurl}/Objetivos/API/post`,objetivo);
  }

  PutObjetivos(objetivo:Objetivo):Observable<any>{
    return this.http.post<Objetivo>(`${this.baseurl}/Objetivos/API/put`,objetivo);
  }

  DeleteObjetivos(id: number): Observable<Object>{
     return this.http.put(`${this.baseurl}/Objetivos/delete`,id);
  }

  UpdateObjetivos(id: number, objetivoActualizado: Objetivo): Observable<Objetivo> {
    return this.http.put<Objetivo>(`${this.baseurl}/Objetivos/${id}`, objetivoActualizado);
  }

  PutSubirNivel(id: number, aumento:number, objetivo: Objetivo): Observable<Objetivo>{
    return this.http.put<Objetivo>(`${this.baseurl}/Objetivos/subirNivel/${id}/${aumento}`, objetivo);
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
