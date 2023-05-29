import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Usuario } from 'app/usuario/interfaces/usuarioModel';
import { MenuItem } from 'primeng/api';
import { ComunidadesUsuariosService } from 'app/usuario/services/comunidades-usuarios.service';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { UsuariosService } from 'app/usuario/services/usuarios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComunidadUsuario } from 'app/usuario/interfaces/comunidadUsuarioModel';
import { VentanaConfirmacionService } from 'app/administracion/ventana-confirmacion/ventana-confirmacion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tarjeta-usuario-admin',
  templateUrl: './tarjeta-usuario.component.html',
  styleUrls: ['./tarjeta-usuario.component.scss']
})
export class TarjetaUsuarioAdminComponent implements OnInit {

  @Input() usuario: Usuario;
  @Input() comunidadActual: Comunidad;
  @Output("parentOnInit") parentOnInit: EventEmitter<any> = new EventEmitter();
  @Input() tipoUsuario: number;

  tooltipItems: MenuItem[];

  tipoUsuarioString: string = '';

  comunidadUsuarioAAdmin: ComunidadUsuario;

  objectDegradarAComun = {
    tooltipOptions: {
      tooltipLabel: 'Degradar a Común',
      tooltipPosition: 'top'
    },
    icon: 'pi pi-user-minus',
    command: () => {
      this.degradarAComun();
    }
  }

  objectDegradarAModerador = {
    tooltipOptions: {
      tooltipLabel: 'Degradar a Moderador',
      tooltipPosition: 'top'
    },
    icon: 'pi pi-user-minus',
    command: () => {
      this.degradarAModerador();
    }
  }


  objectAscenderAModerador = {
    tooltipOptions: {
      tooltipLabel: 'Ascender a Moderador',
      tooltipPosition: 'top'
    },
    icon: 'pi pi-user-plus',
    command: () => {
      this.ascenderAModerador();
    }
  }

  constructor(private toastrService: ToastrService, private modalService: NgbModal, private ventanaConfirmacionService: VentanaConfirmacionService, private comunidadesUsuariosService: ComunidadesUsuariosService, private usuariosService: UsuariosService) { }

  async ngOnInit(): Promise<void> {
    console.log('Nos generamos');

    this.tooltipItems = [
      {
        tooltipOptions: {
          tooltipLabel: 'Expulsar usuario',
          tooltipPosition: 'top'
        },
        icon: 'pi pi-ban',
        command: () => {
          this.expulsarDeLaComunidad();
        }
      }
    ];

    if (this.tipoUsuario > 0) {
      switch (this.tipoUsuario) {
        case 1: {
          this.tipoUsuarioString = 'Usuario común';
          this.tooltipItems.push(this.objectAscenderAModerador);
          break;
        }
        case 2: {
          this.tipoUsuarioString = 'Usuario moderador';
          this.tooltipItems.push(this.objectDegradarAComun);
          break;
        }
        case 3: {
          this.tipoUsuarioString = 'Usuario administrador';
          this.tooltipItems.push(this.objectDegradarAModerador);
          break;
        }
      }
    }

    if (this.tipoUsuario == -1) {
      await this.comunidadesUsuariosService.GetComunidadesUsuariosByUsuarioYComunidad(this.usuario.id_usu, this.comunidadActual.id_com).toPromise().then(resp => {
        this.tooltipItems = [];
      }, (error) => {
        console.log('Este error es intencionado por si no encuentra');
        this.tooltipItems = [
          {
            tooltipOptions: {
              tooltipLabel: 'Añadir usuario',
              tooltipPosition: 'top'
            },
            icon: 'pi pi-plus',
            command: () => {
              this.aniadirUsuario();
            }
          }
        ];
      })
    }

    if (this.tipoUsuario == -2) {
      await this.comunidadesUsuariosService.GetComunidadesUsuariosByUsuarioYComunidad(this.usuario.id_usu, this.comunidadActual.id_com).toPromise().then(resp => {
        if (resp.tipoUsuario == 3) {
          this.tooltipItems = [];
        } else {
          this.tooltipItems = [{
            tooltipOptions: {
              tooltipLabel: 'Convertir en administrador',
              tooltipPosition: 'top'
            },
            icon: 'pi pi-id-card',
            command: () => {
              this.convertirEnAdmin();
            }
          }];
          this.comunidadUsuarioAAdmin = resp;
        }
      }, (error) => {
        console.log('Este error es intencionado por si no encuentra');
        this.tooltipItems = [
          {
            tooltipOptions: {
              tooltipLabel: 'Añadir usuario como administrador',
              tooltipPosition: 'top'
            },
            icon: 'pi pi-plus',
            command: () => {
              this.aniadirUsuario();
            }
          }
        ];
      })
    }
  }

  async expulsarDeLaComunidad() {
    let flag: boolean = false;
    await this.ventanaConfirmacionService.confirmar('¡ALERTA!', `¿Seguro que desea expulsar a este usuario?`)
      .then((confirmado) => flag = confirmado)
      .catch(() => console.log('El usuario ha cerrado la ventana (ej., usando ESC, clickando en la X o pulsando fuera de la ventana)'));
    if (!flag) {
      return;
    }

    await this.comunidadesUsuariosService.GetComunidadesUsuariosByUsuarioYComunidad(this.usuario.id_usu, this.comunidadActual.id_com).toPromise().then(async resp => {
      await this.comunidadesUsuariosService.DeleteComunidadBBDD(resp.id_com_usu, resp).toPromise().then(resp => {
      })
    })
    this.parentOnInit.emit();
  }

  async ascenderAModerador() {
    let flag: boolean = false;
    await this.ventanaConfirmacionService.confirmar('¡ALERTA!', `¿Seguro que desea ascender a moderador a este usuario?`)
      .then((confirmado) => flag = confirmado)
      .catch(() => console.log('El usuario ha cerrado la ventana (ej., usando ESC, clickando en la X o pulsando fuera de la ventana)'));
    if (!flag) {
      return;
    }

    await this.comunidadesUsuariosService.GetComunidadesUsuariosByUsuarioYComunidad(this.usuario.id_usu, this.comunidadActual.id_com).toPromise().then(async resp => {
      resp.tipoUsuario = 2;
      await this.comunidadesUsuariosService.PutComunidadesUsuarisoIdBBDD(resp.id_com_usu, resp).toPromise().then()
    });
    this.parentOnInit.emit();
  }

  async degradarAModerador() {
    let flag: boolean = false;
    await this.ventanaConfirmacionService.confirmar('¡ALERTA!', `¿Seguro que desea degradar a moderador a este usuario?`)
      .then((confirmado) => flag = confirmado)
      .catch(() => console.log('El usuario ha cerrado la ventana (ej., usando ESC, clickando en la X o pulsando fuera de la ventana)'));
    if (!flag) {
      return;
    }

    await this.comunidadesUsuariosService.GetComunidadesUsuariosByUsuarioYComunidad(this.usuario.id_usu, this.comunidadActual.id_com).toPromise().then(async resp => {
      resp.tipoUsuario = 2;
      await this.comunidadesUsuariosService.PutComunidadesUsuarisoIdBBDD(resp.id_com_usu, resp).toPromise().then()
    });
    this.parentOnInit.emit();
  }

  async degradarAComun() {
    let flag: boolean = false;
    await this.ventanaConfirmacionService.confirmar('¡ALERTA!', `¿Seguro que desea degradar a común a este usuario?`)
      .then((confirmado) => flag = confirmado)
      .catch(() => console.log('El usuario ha cerrado la ventana (ej., usando ESC, clickando en la X o pulsando fuera de la ventana)'));
    if (!flag) {
      return;
    }

    await this.comunidadesUsuariosService.GetComunidadesUsuariosByUsuarioYComunidad(this.usuario.id_usu, this.comunidadActual.id_com).toPromise().then(async resp => {
      resp.tipoUsuario = 1;
      await this.comunidadesUsuariosService.PutComunidadesUsuarisoIdBBDD(resp.id_com_usu, resp).toPromise().then()
    });
    this.parentOnInit.emit();
  }

  async aniadirUsuario() {

    let nuevaComunidadUsuario: ComunidadUsuario = {
      id_com_usu: 0,
      id_com: this.comunidadActual.id_com,
      id_usu: this.usuario.id_usu,
      // comunidad: this.comunidadActual,
      // usuario: globales.usuarioLogueado,
      apodo: this.usuario.nick,
      nivel: 1,
      tipoUsuario: 1
    }

    if (this.tipoUsuario == -2) {
      nuevaComunidadUsuario.tipoUsuario = 3;
    }

    await this.comunidadesUsuariosService.PostComunidadBBDD(nuevaComunidadUsuario).toPromise().then(resp => {
      this.toastrService.success('Usuario creado con exito');
      this.closeBtnClick();
    })

  }

  async convertirEnAdmin() {
    this.comunidadUsuarioAAdmin.tipoUsuario = 3;
    await this.comunidadesUsuariosService.PutComunidadesUsuarisoIdBBDD(this.comunidadUsuarioAAdmin.id_com_usu, this.comunidadUsuarioAAdmin).toPromise().then(resp => {
      this.toastrService.success('Usuario ascendido con exito');
      this.closeBtnClick();
    });
  }

  closeBtnClick() {
    this.modalService.dismissAll();
    this.parentOnInit.emit();
  }

}
