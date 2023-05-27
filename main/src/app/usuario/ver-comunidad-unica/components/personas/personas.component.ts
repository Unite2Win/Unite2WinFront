import { Component, Input, OnInit } from '@angular/core';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { ComunidadUsuario } from 'app/usuario/interfaces/comunidadUsuarioModel';
import { Usuario } from 'app/usuario/interfaces/usuarioModel';
import { ComunidadesUsuariosService } from 'app/usuario/services/comunidades-usuarios.service';
import { UsuariosService } from 'app/usuario/services/usuarios.service';
import { globales } from 'common/globales';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss']
})
export class PersonasComponent implements OnInit {

  @Input() usuariosTotales: number;
  @Input() comunidadActual: Comunidad;

  usuarioActual: Usuario = globales.usuarioLogueado;

  usuariosTipo1: Usuario[] = [];
  usuariosTipo1ID: number[] = [];
  usuariosTipo2: Usuario[] = [];
  usuariosTipo2ID: number[] = [];
  usuariosTipo3: Usuario[] = [];
  usuariosTipo3ID: number[] = [];
  
  usuariosComunidades: ComunidadUsuario[] = [];

  usuariosFiltrados: Usuario[] = [];
  todosUsuarios: Usuario[] = [];

  _descripcionBusqueda = '';

  get descripcionBusqueda(): string {
    return this._descripcionBusqueda;
  }

  set descripcionBusqueda(val: string) {
    this._descripcionBusqueda = val.toLocaleLowerCase();
    this.usuariosFiltrados = this.filtrarIdiomas(this.descripcionBusqueda);
  }

  loadingFlag: boolean = true;

  constructor(private usuariosService: UsuariosService, private comunidadesUsuariosService: ComunidadesUsuariosService) { }

  async ngOnInit(): Promise<void> {
    await this.inicializarUsuarios();
    this.loadingFlag = false;
  }

  async inicializarUsuarios() {
    await this.comunidadesUsuariosService.GetComunidadesUsuariosByComunidad(this.comunidadActual.id_com).toPromise().then(resp => {
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

}
