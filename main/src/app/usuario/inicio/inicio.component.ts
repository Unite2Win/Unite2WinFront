import { Component, OnInit } from '@angular/core';
import { Objetivo } from '../interfaces/objetivo';
import { ObjetivosService } from '../services/objetivos.service';
import { globales } from 'common/globales';
import { Usuario } from '../interfaces/usuarioModel';
import { Router } from '@angular/router';
import { VentanaConfirmacionService } from 'app/administracion/ventana-confirmacion/ventana-confirmacion.service';
import { LoginService } from 'app/authentication/login/login.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComunidadesService } from 'app/usuario/services/comunidades.service';
import { ManejoDocsService } from 'app/usuario/services/manejo-docs.service';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { AdminComunidadesService } from 'app/administracion/admin-comunidades/admin-comunidades.service';
import { ComunidadesUsuariosService } from '../services/comunidades-usuarios.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  objetivo: Objetivo;
  objetivos: Objetivo[] = [];
  ObjetivosTitulo: String = 'Objetivos Activos:';
  TextoBoton: String = 'Ver todos los objetivos';
  globales: globales;
  usuario: Usuario = globales.usuarioLogueado;

  selectedOption = 1;

  borrarDisabled: boolean = false;

  page = 1;
  pageSize = 40;

  size = 0

  actualPage = 0

  loadingFlag = true;
  noDataFlag = false;

  comunidadesFiltrados: Comunidad[] = [];
  todosComunidades: Comunidad[] = [];

  comunidadSeleccionado: Comunidad;

  _descripcionBusqueda = '';

  IdTokenPerfilActual: number;

  constructor(private objetivosService: ObjetivosService, private router: Router, private ventanaConfirmacionService: VentanaConfirmacionService, private loginService: LoginService, private modalService: NgbModal, private fb: FormBuilder, private manejoDocsService: ManejoDocsService, private comunidadesService: ComunidadesService, private comunidadesUsuariosService: ComunidadesUsuariosService, private adminComunidadesService: AdminComunidadesService) { }

  async ngOnInit() {
    await this.objetivosService.getObjetivos();
    this.objetivos = this.objetivosService.objetivosBd;
    if (this.objetivos.length == 0) {
      this.ObjetivosTitulo = 'Aun no hay objetivos';
      this.TextoBoton = 'Crear objetivos';
    } else if (this.objetivos.length > 2) {
      this.objetivos = this.objetivos.slice(0, 2);
    };
    if (this.actualPage == 0) {
      this.IdTokenPerfilActual = Number(this.loginService.AUTH_USERID);

      this.todosComunidades = [];
      this.comunidadesFiltrados = [];

      this.loadingFlag = true;
      this.noDataFlag = false;

      let a = this.comunidadesUsuariosService.GetComunidadesUsuariosCount(this.usuario.id_usu).toPromise();

      await a.then(count => {
        this.size = count;

        if (this.size === 0) {
          this.noDataFlag = true;
        } else {
          this.noDataFlag = false;
        }
      });

      if (!this.noDataFlag) {
        var idsComunidades;

        await this.comunidadesUsuariosService.GetComunidadesUsuariosPaginado(0, this.pageSize, this.usuario.id_usu).toPromise().then(resp => {
          idsComunidades = resp;
        });

        for await (let comunidad of idsComunidades) {
          await this.comunidadesService.GetComunidadById(comunidad.id_com).toPromise().then(resp => {
            this.todosComunidades.push(resp);
          });
        }

        console.log(this.todosComunidades);

        this.comunidadesFiltrados = this.todosComunidades;

        if (this.comunidadesFiltrados.length > 5) {
          this.comunidadesFiltrados = this.comunidadesFiltrados.slice(0, 5);
        }
      }
      this.loadingFlag = false;
    }
  }

  irAComunidad(comunidad: Comunidad) {
    return `usuario/comunidad/${comunidad.id_com}`
  }


  irObjetivos() {
    this.router.navigate(['/usuario/objetivos']);
  }

  getProgressBarValue(objetivo: Objetivo): number {
    const fechaString = objetivo.create_date;
    const fecha = new Date(fechaString);
    const diferenciaEnDias = Math.floor((new Date().getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
    let progreso = (diferenciaEnDias / objetivo.duracion) * 100;
    progreso = Math.min(progreso, 100); // Para que no supere el 100%
    if (progreso === 100) { //Aqui se comprueba si esta ya al 100% el objetivo para modificarlo en la bd
      objetivo.complete_date = new Date();
    }
    return progreso;

  }

}
