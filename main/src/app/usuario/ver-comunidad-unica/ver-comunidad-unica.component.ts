import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'app/authentication/login/login.service';
import { switchMap } from 'rxjs/operators';
import { ComunidadesService } from '../services/comunidades.service';
import { Comunidad } from '../interfaces/comunidadModel';
import { DecodedBase64 } from '../interfaces/decodedBase64Model';
import { MenuItem } from 'primeng/api';
import { TabMenu } from 'primeng/tabmenu';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ComunidadesUsuariosService } from '../services/comunidades-usuarios.service';
import { globales } from 'common/globales';
import { ComunidadUsuario } from '../interfaces/comunidadUsuarioModel';
import { VentanaConfirmacionService } from '../../administracion/ventana-confirmacion/ventana-confirmacion.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ver-comunidad-unica',
  templateUrl: './ver-comunidad-unica.component.html',
  styleUrls: ['./ver-comunidad-unica.component.scss']
})
export class VerComunidadUnicaComponent implements OnInit {

  miFormCompartir: FormGroup = this.fb.group({
    url: ''
  });

  url = environment.baseUrl

  idComunidadActual: number = 0;
  comunidadActual: Comunidad = {
    id_com: 0,
    nombre: '',
    descripcion: '',
    clave: '',
    banner: null,
    picture: null,
    isVisible: true,
    isPublica: true
  };

  items: MenuItem[];
  activeItem: MenuItem;

  mostrarFeed: boolean = false;
  mostrarPersonas: boolean = false;
  mostrarEventos: boolean = false;
  mostrarMultimedia: boolean = false;

  yaSoyMiembro: boolean = false;
  salirmeDeComunidad: boolean = false;

  usuariosTotales: number = 0;

  loadingFlag: boolean = true;

  constructor(private ventanaConfirmacionService: VentanaConfirmacionService, private toastrService: ToastrService, private fb: FormBuilder, private modalService: NgbModal, private router: Router, private activatedRoute: ActivatedRoute, private loginService: LoginService, private comunidadesService: ComunidadesService, private comunidadesUsuariosService: ComunidadesUsuariosService) { }

  async ngOnInit(): Promise<void> {
    var url: string[] = window.location.pathname.split('/');
    this.idComunidadActual = Number(url[url.length - 1]);

    await this.comunidadesService.GetComunidadById(this.idComunidadActual).toPromise().then(comunidad => {
      this.comunidadActual = comunidad;
    }, (error) => {
      this.router.navigate(['/usuario/miscomunidades'])
    })

    this.items = [
      { label: 'Feed', icon: 'mdi mdi-comment-processing' },
      { label: 'Personas', icon: 'mdi mdi-account' },
      { label: 'Eventos', icon: 'mdi mdi-coffee' },
      { label: 'Multimedia', icon: 'mdi mdi-image' },
    ];
    this.activeItem = this.items[0];
    this.mostrarFeed = true;

    this.comunidadesUsuariosService.GetComunidadesUsuariosCountByComunidad(this.idComunidadActual).toPromise().then(resp => {
      this.usuariosTotales = resp;
    })

    this.comunidadesUsuariosService.GetComunidadesUsuariosIsMember(globales.usuarioLogueado.id_usu, this.idComunidadActual).toPromise().then(resp => {
      this.yaSoyMiembro = resp;
    })

    this.loadingFlag = false;
  }

  compartirComunidad(targetModal: string, size: string) {
    console.log(window.location.href);
    this.miFormCompartir.get('url').setValue(window.location.href);
    this.openModal(targetModal, size);
  }

  sobreUnirme() {
    this.salirmeDeComunidad = true;
  }

  fueraUnirme() {
    this.salirmeDeComunidad = false;
  }

  async unirmeAComunidad() {

    let nuevaComunidadUsuario: ComunidadUsuario = {
      id_com_usu: 0,
      id_com: this.idComunidadActual,
      id_usu: globales.usuarioLogueado.id_usu,
      // comunidad: this.comunidadActual,
      // usuario: globales.usuarioLogueado,
      apodo: globales.usuarioLogueado.name,
      nivel: 1,
      tipoUsuario: 3
    }

    console.log(nuevaComunidadUsuario);

    await this.comunidadesUsuariosService.PostComunidadBBDD(nuevaComunidadUsuario).toPromise().then(resp => {
      console.log(resp);
    })

    this.ngOnInit();
  }

  async salirmeDeLaComunidad() {

    let flag: boolean = false;

    await this.ventanaConfirmacionService.confirmar('¡ALERTA!', `¿Seguro que desea salir de la comunidad?`)
      .then((confirmado) => flag = confirmado)
      .catch(() => console.log('El usuario ha cerrado la ventana (ej., usando ESC, clickando en la X o pulsando fuera de la ventana)'));

    if (!flag) {
      return;
    }

    await this.comunidadesUsuariosService.GetComunidadesUsuariosByUsuarioYComunidad(globales.usuarioLogueado.id_usu, this.idComunidadActual).toPromise().then(async resp => {
      await this.comunidadesUsuariosService.DeleteComunidadBBDD(resp.id_com_usu, resp).toPromise().then(resp => {
      })
    })
    this.ngOnInit();
  }

  copiarUrl() {
    navigator.clipboard.writeText(this.miFormCompartir.get('url').value)
      .then(() => {
      })
    this.toastrService.success('Enlace de la comunidad copiado')
  }

  onActiveItemChange(event: TabMenu) {
    switch (event.activeItem.label) {
      case 'Feed': this.noMostrarNada(); this.mostrarFeed = true; break;
      case 'Personas': this.noMostrarNada(); this.mostrarPersonas = true; break;
      case 'Eventos': this.noMostrarNada(); this.mostrarEventos = true; break;
      case 'Multimedia': this.noMostrarNada(); this.mostrarMultimedia = true; break;
    }
  }

  noMostrarNada() {
    this.mostrarFeed = false;
    this.mostrarPersonas = false;
    this.mostrarMultimedia = false;
    this.mostrarEventos = false;
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

  openModal(targetModal: string, size: string) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: size
    });
  }

  closeBtnClick() {
    this.modalService.dismissAll();
  }

}
