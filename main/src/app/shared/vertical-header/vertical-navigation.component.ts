import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../authentication/login/login.service';
import { globales } from 'common/globales';
import { ObjetivosService } from 'app/usuario/services/objetivos.service';
import { Router } from '@angular/router';
import { ComunidadesUsuariosService } from 'app/usuario/services/comunidades-usuarios.service';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { ComunidadesService } from 'app/usuario/services/comunidades.service';
declare var $: any;

@Component({
  selector: 'app-vertical-navigation',
  templateUrl: './vertical-navigation.component.html'
})
export class VerticalNavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public config: PerfectScrollbarConfigInterface = {};

  public showSearch = false;

  get usuarioLogueado() {
    return globales.usuarioLogueado;
  }

  // This is for Notifications
  notifications: Object[] = [
    {
      btn: 'btn-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      btn: 'btn-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      btn: 'btn-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      btn: 'btn-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/user1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/user2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/user2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/user4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  public selectedLanguage: any = {
    language: 'Español',
    code: 'es',
    icon: 'es'
  }

  public languages: any[] = [{
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  },
  {
    language: 'Español',
    code: 'es',
    icon: 'es'
  }]

  objetivos
  page = 1;
  pageSize = 40;
  todosComunidades: Comunidad[] = [];

  get globales() {
    return globales.usuarioLogueado;
  }

  constructor(private modalService: NgbModal, private translate: TranslateService, private loginService: LoginService, private objetivosService: ObjetivosService, private router: Router, private comunidadesUsuariosService: ComunidadesUsuariosService, private comunidadesService: ComunidadesService) {
    translate.setDefaultLang('en');
    
    this.obtenerObjetivos()
    this.obtenerComunidades()
  }

  async obtenerObjetivos() {
    await this.objetivosService.GetObjetivosUsuario(globales.usuarioLogueado.id_usu).toPromise().then(x => {
      if (x.length >= 3) {
        this.objetivos = x.slice(0, 3);
      } else {
        this.objetivos = x;
      }
      console.log(this.objetivos)
    })
  }

  async obtenerComunidades() {
    var idsComunidades
    console.log('YEE')
    await this.comunidadesUsuariosService.GetComunidadesUsuariosPaginado(0, this.pageSize, this.globales.id_usu).toPromise().then(resp => {
      console.log(resp)
      idsComunidades = resp
    });
    console.log(idsComunidades);

    idsComunidades.forEach(comunidad => {
      this.comunidadesService.GetComunidadById(comunidad.id_com).toPromise().then(resp => {
        this.todosComunidades.push(resp)
      })

      console.log(comunidad);
    })
    console.log(this.todosComunidades);
    if (this.todosComunidades.length >= 3) {
      this.todosComunidades = this.todosComunidades.slice(0, 3);
    } else {
      this.todosComunidades = this.todosComunidades;
    }
  }

  irObjetivos() {
    this.router.navigate(['/usuario/objetivos']);
  }

  irComunidades() {
    this.router.navigate(['/usuario/miscomunidades']);
  }

  irComunidadesExplorar() {
    this.router.navigate(['/usuario/explorar']);
  }

  changeLanguage(lang: any) {
    this.translate.use(lang.code)
    this.selectedLanguage = lang;
  }

  ngAfterViewInit() { }

  logout() {
    this.loginService.logout();

  }
}