import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VentanaConfirmacionService } from 'app/administracion/ventana-confirmacion/ventana-confirmacion.service';
import { Post } from 'app/usuario/interfaces/postModel';
import { Usuario } from 'app/usuario/interfaces/usuarioModel';
import { PostsService } from 'app/usuario/services/posts.service';
import { UsuariosService } from 'app/usuario/services/usuarios.service';
import { globales } from 'common/globales';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-tarjeta-post',
  templateUrl: './tarjeta-post.component.html',
  styleUrls: ['./tarjeta-post.component.scss']
})
export class TarjetaPostComponent implements OnInit {

  @Output("parentOnInit") parentOnInit: EventEmitter<any> = new EventEmitter();
  @Input() postActual: Post;
  @Input() isMultimedia: boolean;

  usuarioActual: Usuario = {
    nick: '',
    password: '',
    name: '',
    surname: '',
    email: '',
    level: 0,
    active: false,
    picture: null
  };

  tooltipItems: MenuItem[];

  fechaCreacion: string;

  constructor(private modalService: NgbModal, private toastrService: ToastrService, private ventanaConfirmacionService: VentanaConfirmacionService, private postsService: PostsService, private usuariosService: UsuariosService, private dp: DatePipe) { }

  async ngOnInit(): Promise<void> {

    this.tooltipItems = [
      {
        tooltipOptions: {
          tooltipLabel: 'Eliminar post',
          tooltipPosition: 'right'
        },
        icon: 'pi pi-trash',
        command: () => {
          this.eliminarPost();
        }
      }
    ];

    await this.usuariosService.getUsuarioById(this.postActual.usuarioID).toPromise().then(usuario => {
      this.usuarioActual = usuario;
    });

    this.fechaCreacion = this.dp.transform(this.postActual.create_date, 'dd/MM/yyyy');

  }

  async eliminarPost() {
    let flag: boolean = false;
    await this.ventanaConfirmacionService.confirmar('¡Alerta!', `¿Seguro que desea borrar el post?`)
      .then((confirmado) => flag = confirmado)
      .catch(() => console.log('El usuario ha cerrado la ventana (ej., usando ESC, clickando en la X o pulsando fuera de la ventana)'));
    if (!flag) {
      return;
    }
    await this.postsService.DeletePostBBDD(this.postActual.id_post, this.postActual).toPromise().then();
    this.toastrService.success('El evento ha sido eliminado')
    this.parentOnInit.emit();
  }

  openModal(targetModal: string) {
    this.modalService.open(targetModal, {
      centered: true,
      size: 'xl'
    });
  }

  closeBtnClick() {
    this.modalService.dismissAll();
  }

  esMiPost() {
    return globales.usuarioLogueado.id_usu == this.usuarioActual.id_usu;
  }

  miTipoUsuario() {
    return globales.tipoUsuario;
  }

}
