import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Objetivo } from 'app/interfaces/ObjetivoModel';

@Injectable({
  providedIn: 'root'
})
export class ObjetivosService {

  url = environment.url

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Objetivo[]> {
    return this.http.get<Objetivo[]>(`${this.url}/Objetivos`);
  }
  
}
