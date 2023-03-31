import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Documento } from 'app/interfaces/documentoModel';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  url = environment.url

  constructor(private http: HttpClient) { }

  public postDocumento(documento: Documento): Observable<Documento> {
    return this.http.post<Documento>(`${this.url}/Documentos`, documento)
  }
  
}
