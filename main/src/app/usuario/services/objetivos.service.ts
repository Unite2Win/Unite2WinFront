import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Objetivo } from '../interfaces/objetivo';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

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
