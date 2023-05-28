import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { Post } from '../interfaces/postModel';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  baseurl = environment.url;

  constructor(private http: HttpClient) { }

  GetPostsBBDD(): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${this.baseurl}/Posts`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetPostByIdArrayComunidadesUsuarios(arrayId: number[]): Observable<Post[]> {
    return this.http
      .post<Post[]>(`${this.baseurl}/Posts/posts/getbyid/comunidadesUsuarios/array`, arrayId)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetPostByIdArrayComunidadesUsuariosMultimedia(arrayId: number[]): Observable<Post[]> {
    return this.http
      .post<Post[]>(`${this.baseurl}/Posts/posts/getbyid/comunidadesUsuarios/array/multimedia`, arrayId)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetPostById(postId: number): Observable<Post> {
    return this.http
      .get<Post>(`${this.baseurl}/Posts/${postId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  GetPostsPorComunidadUsuario(comunidadUsuarioId: number): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${this.baseurl}/Posts/${comunidadUsuarioId}/comunidadUsuariosId/`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  PutPostIdBBDD(
    PostId: number,
    evento: Post
  ): Observable<Post> {
    return this.http
      .put<Post>(
        `${this.baseurl}/Posts/${PostId}`,
        evento
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  DeletePostBBDD(
    PostId: number,
    evento: Post
  ): Observable<Post> {
    return this.http
      .put<Post>(
        `${this.baseurl}/Posts/${PostId}/delete`,
        evento
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  PostPostsBBDD(Post: Post): Observable<Post> {
    return this.http
      .post<Post>(`${this.baseurl}/Posts`, Post)
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
