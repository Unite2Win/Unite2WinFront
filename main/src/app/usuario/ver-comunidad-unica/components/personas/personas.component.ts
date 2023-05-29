import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { ComunidadUsuario } from 'app/usuario/interfaces/comunidadUsuarioModel';
import { Usuario } from 'app/usuario/interfaces/usuarioModel';
import { ComunidadesUsuariosService } from 'app/usuario/services/comunidades-usuarios.service';
import { UsuariosService } from 'app/usuario/services/usuarios.service';
import { globales } from 'common/globales';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss']
})
export class PersonasComponent implements OnInit {

  @Input() usuariosTotales: number;
  @Input() comunidadActualINPUT: Comunidad;
  
  usuarioActual: Usuario = globales.usuarioLogueado;

  comunidadAUX: Comunidad = {
    id_com: 0,
    nombre: '',
    descripcion: '',
    clave: '',
    isVisible: false,
    isPublica: false
  };

  usuariosTipo1: Usuario[] = [];
  usuariosTipo1ID: number[] = [];
  usuariosTipo2: Usuario[] = [];
  usuariosTipo2ID: number[] = [];
  usuariosTipo3: Usuario[] = [];
  usuariosTipo3ID: number[] = [];

  usuariosComunidades: ComunidadUsuario[] = [];

  usuariosFiltrados: Usuario[] = [];
  todosUsuarios: Usuario[] = [];

  addSearchUsuarios: Usuario[] = [];

  criterioBusquedaUsuarioBBDD: string = '';

  mensajeFalloBusqueda: string = 'Pruebe a buscar usuarios.'

  _descripcionBusqueda = '';

  get descripcionBusqueda(): string {
    return this._descripcionBusqueda;
  }

  set descripcionBusqueda(val: string) {
    this._descripcionBusqueda = val.toLocaleLowerCase();
    this.usuariosFiltrados = this.filtrarIdiomas(this.descripcionBusqueda);
  }

  loadingFlag: boolean = true;
  isLoadingAddUser: boolean = false;

  constructor(private toastrService: ToastrService, private modalService: NgbModal, private fb: FormBuilder, private usuariosService: UsuariosService, private comunidadesUsuariosService: ComunidadesUsuariosService) { }

  async ngOnInit(): Promise<void> {
    this.resetTodo();
    await this.inicializarUsuarios();
    this.loadingFlag = false;
  }

  resetTodo() {
    this.usuariosTipo1 = [];
    this.usuariosTipo1ID = [];
    this.usuariosTipo2 = [];
    this.usuariosTipo2ID = [];
    this.usuariosTipo3 = [];
    this.usuariosTipo3ID = [];
    this.usuariosFiltrados = [];
    this.todosUsuarios = [];
    this.usuariosComunidades = [];
  }

  async inicializarUsuarios() {
    await this.comunidadesUsuariosService.GetComunidadesUsuariosByComunidad(this.comunidadActualINPUT.id_com).toPromise().then(resp => {
      resp.forEach(ComUs => {
        switch (ComUs.tipoUsuario) {
          case 1: this.usuariosTipo1ID.push(ComUs.id_usu); this.usuariosComunidades.push(ComUs); break;
          case 2: this.usuariosTipo2ID.push(ComUs.id_usu); this.usuariosComunidades.push(ComUs); break;
          case 3: this.usuariosTipo3ID.push(ComUs.id_usu); this.usuariosComunidades.push(ComUs); break;
        }
      });
    });

    await this.usuariosService.GetUsuariosByIdArray(this.usuariosTipo1ID).toPromise().then(resp => {
      this.usuariosTipo1 = resp;
      resp.forEach(r => this.todosUsuarios.push(r));
    }, (error) => {
      console.log('Este error debe salir si no hay usuarios de tipo 1');
    });
    await this.usuariosService.GetUsuariosByIdArray(this.usuariosTipo2ID).toPromise().then(resp => {
      this.usuariosTipo2 = resp;
      resp.forEach(r => this.todosUsuarios.push(r));
    }, (error) => {
      console.log('Este error debe salir si no hay usuarios de tipo 2');
    });
    await this.usuariosService.GetUsuariosByIdArray(this.usuariosTipo3ID).toPromise().then(resp => {
      this.usuariosTipo3 = resp;
      resp.forEach(r => this.todosUsuarios.push(r));
    }, (error) => {
      console.log('Este error debe salir si no hay usuarios de tipo 3');
    });
  }

  sacarTipoUsuario(usuario: Usuario): number {
    return this.usuariosComunidades.find(uc => uc.id_usu == usuario.id_usu).tipoUsuario;
  }

  filtrarIdiomas(v: string) {
    return this.todosUsuarios.filter(x => x.name.toLowerCase().indexOf(v.toLowerCase()) !== -1 || x.surname.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

  async searchUser() {
    this.isLoadingAddUser = true;
    this.addSearchUsuarios = [];
    this.mensajeFalloBusqueda = 'No hay resultados con el criterio seleccionado.';
    await this.usuariosService.GetByNick(this.criterioBusquedaUsuarioBBDD).toPromise().then(resp => {
      this.addSearchUsuarios = resp;
      console.log(this.addSearchUsuarios);
    }, (error) => {
      this.toastrService.error('No hay usuarios con el criterio introducido.');
      console.log('Este error debe salir si no hay usuaris con este criterio');
    });
    this.isLoadingAddUser = false;
  }

  openModal(targetModal: string, size: string) {
    this.criterioBusquedaUsuarioBBDD = '';
    this.addSearchUsuarios = [];
    this.mensajeFalloBusqueda = 'Pruebe a buscar usuarios.';
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: size
    });
  }

  closeBtnClick() {
    this.modalService.dismissAll();
    this.ngOnInit();
  }

  miTipoUsuario() {
    return globales.tipoUsuario;
  }

}
