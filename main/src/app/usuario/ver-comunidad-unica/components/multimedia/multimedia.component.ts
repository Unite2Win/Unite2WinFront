import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { ComunidadUsuario } from 'app/usuario/interfaces/comunidadUsuarioModel';
import { DecodedBase64 } from 'app/usuario/interfaces/decodedBase64Model';
import { Documento } from 'app/usuario/interfaces/documentoModel';
import { Post } from 'app/usuario/interfaces/postModel';
import { Usuario } from 'app/usuario/interfaces/usuarioModel';
import { ComunidadesUsuariosService } from 'app/usuario/services/comunidades-usuarios.service';
import { PostsService } from 'app/usuario/services/posts.service';
import { UsuariosService } from 'app/usuario/services/usuarios.service';
import { globales } from 'common/globales';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.scss']
})
export class MultimediaComponent implements OnInit {

  @Input() comunidadActual: Comunidad;

  todosPost: Post[] = [];

  usuarioActual: Usuario = globales.usuarioLogueado;

  loadingFlag: boolean = true;

  cuArray: ComunidadUsuario[] = [];

  constructor(private comunidadesUsuariosService: ComunidadesUsuariosService, private postsService: PostsService) { }

  async ngOnInit(): Promise<void> {
    await this.comunidadesUsuariosService.GetComunidadesUsuariosByComunidad(this.comunidadActual.id_com).toPromise().then(async resp => {
      let arrayID: number[] = []
      this.cuArray = resp;
      resp.forEach(cu => {
        arrayID.push(cu.id_com_usu);
      })
      await this.postsService.GetPostByIdArrayComunidadesUsuariosMultimedia(arrayID).toPromise().then(resp => {
        this.todosPost = resp;
        this.todosPost.forEach(post => {
          post.usuarioID = this.cuArray.find(cu => cu.id_com_usu == post.id_com_usu).id_usu;
        });
      }, () => {
        console.log('Este error debe salir si no hay posts disponibles');
      });
    });

    this.loadingFlag = false;
  }

}
