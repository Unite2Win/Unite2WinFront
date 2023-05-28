import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  @Input() comunidadActual: Comunidad;
  @Input() isMiembro: boolean;
  @ViewChild('fileInputRef') fileInput: ElementRef;

  miFormCompartir: FormGroup = this.fb.group({
    url: ['', Validators.required]
  });

  miFormPost: FormGroup = this.fb.group({
    descripcion: ['', Validators.required],
    imagen: ''
  });

  todosPost: Post[] = [];

  usuarioActual: Usuario = globales.usuarioLogueado;

  aniversario: string;

  loadingFlag: boolean = true;

  docImagen: Documento;

  cuArray: ComunidadUsuario[] = [];

  constructor(private toastrService: ToastrService, private dp: DatePipe, private fb: FormBuilder, private comunidadesUsuariosService: ComunidadesUsuariosService, private postsService: PostsService, private usuariosService: UsuariosService) { }

  async ngOnInit(): Promise<void> {
    this.docImagen = null;
    this.aniversario = this.dp.transform(this.comunidadActual.create_date, 'dd-MM-yyyy', 'es-ES');
    this.aniversario = this.aniversario.replace(new RegExp('-', 'g'), '/');

    await this.comunidadesUsuariosService.GetComunidadesUsuariosByComunidad(this.comunidadActual.id_com).toPromise().then(async resp => {
      let arrayID: number[] = []
      this.cuArray = resp;
      resp.forEach(cu => {
        arrayID.push(cu.id_com_usu);
      })
      await this.postsService.GetPostByIdArrayComunidadesUsuarios(arrayID).toPromise().then(resp => {
        this.todosPost = resp;
        this.todosPost.forEach(post => {
          post.usuarioID = this.cuArray.find(cu => cu.id_com_usu == post.id_com_usu).id_usu;
        });
      }, (error) => {
        console.log('Este error debe salir si no hay posts disponibles');
      });
    });

    this.loadingFlag = false;
  }

  activarFileInput() {
    this.fileInput.nativeElement.click();
  }

  eliminarImagen() {
    this.docImagen = null;
  }

  async publicarPost() {
    let cuActual = this.cuArray.find(x => x.id_com == this.comunidadActual.id_com && x.id_usu == this.usuarioActual.id_usu);
    let nuevoPost: Post = {
      id_post: 0,
      id_com_usu: cuActual.id_com_usu,
      imagen: this.docImagen,
      titulo: `Post de ${this.usuarioActual.name} ${this.usuarioActual.surname}`,
      descripcion: this.miFormPost.get('descripcion').value,
      likes: 0
    }
    if (nuevoPost.descripcion.length <= 0 || nuevoPost.descripcion.trim() == '') {
      this.toastrService.warning('No puedes hacer un post sin texto');
      return;
    }
    await this.postsService.PostPostsBBDD(nuevoPost).toPromise().then();
    this.toastrService.success('Post creado con exito');
    this.miFormPost.reset();
    this.ngOnInit()
  }

  async fileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = target.files[0];
    if (file) {
      await this.file2Base64(file).then(
        (res) => {
          this.docImagen = {
            id_doc: 0,
            data: res.data,
            descripcion: res.descripcion,
            extensionArchivo: res.fileExtension
          };
        }
      );
    }
  }

  file2Base64 = (file: File): Promise<DecodedBase64> => {
    return new Promise<DecodedBase64>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let data = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((data.length % 4) > 0) {
          data += '='.repeat(4 - (data.length % 4));
        }
        const answer: DecodedBase64 = {
          data: data,
          descripcion: file.name,
          fileExtension: file.type
        }
        resolve(answer);
      };
      reader.onerror = error => reject(error);
    });
  }

}
