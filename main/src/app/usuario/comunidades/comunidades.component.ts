import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'app/authentication/login/login.service';
import { ComunidadesService } from 'app/usuario/services/comunidades.service';
import { ManejoDocsService } from 'app/usuario/services/manejo-docs.service';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { VentanaConfirmacionService } from 'app/administracion/ventana-confirmacion/ventana-confirmacion.service';
import { AdminComunidadesService } from 'app/administracion/admin-comunidades/admin-comunidades.service';
import { ComunidadesUsuariosService } from '../services/comunidades-usuarios.service';
import { globales } from 'common/globales';
import { Documento } from '../interfaces/documentoModel';

@Component({
  selector: 'app-comunidades',
  templateUrl: './comunidades.component.html',
  styleUrls: ['./comunidades.component.scss']
})
export class ComunidadesComponent implements OnInit {

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

  get descripcionBusqueda(): string {
    return this._descripcionBusqueda;
  }

  set descripcionBusqueda(val: string) {
    this._descripcionBusqueda = val;
    this.comunidadesFiltrados = this.filtrarIdiomas(val);
  }

  //ESTO ES PARA LOS MODALES DE EDICION, CREADO Y BORRADO
  miFormComunidades: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    clave: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    banner: [''],
    picture: ['']
  });

  comunidadesOBJ: Comunidad[] = [];
  comunidadesDescripcion: String[] = [];

  selectedComBorrar: String;
  selectedComEditar: String;

  mensajeModalDelete: string = ""
  tituloModalDelete: string = ""

  docPicture: Documento = null;
  docBanner: Documento = null;
  ///////////////////////////////////////////////////

  get globales() {
    return globales.usuarioLogueado;
  }

  constructor(private ventanaConfirmacionService: VentanaConfirmacionService, private loginService: LoginService, private modalService: NgbModal, private fb: FormBuilder, private manejoDocsService: ManejoDocsService, private comunidadesService: ComunidadesService, private comunidadesUsuariosService: ComunidadesUsuariosService, private adminComunidadesService: AdminComunidadesService) { }

  async ngOnInit(): Promise<void> {

    if (this.actualPage == 0) {
      this.IdTokenPerfilActual = Number(this.loginService.AUTH_USERID);

      this.todosComunidades = [];
      this.comunidadesFiltrados = [];

      this.loadingFlag = true;
      this.noDataFlag = false;

      let a = this.comunidadesUsuariosService.GetComunidadesUsuariosCount(this.globales.id_usu).toPromise()
      await a.then(count => {
        console.log(count)
        this.size = count
        if (this.size === 0) {
          this.noDataFlag = true;
        } else {
          this.noDataFlag = false;
        }
      })

      if (this.noDataFlag == false) {
        var idsComunidades
        console.log('YEE')
        await this.comunidadesUsuariosService.GetComunidadesUsuariosPaginado(0, this.pageSize, this.globales.id_usu).toPromise().then(resp => {
          console.log(resp)
          idsComunidades = resp
        // let comunidadesIDs: number[] = []
        // await this.comunidadesUsuariosService.GetComunidadesUsuariosByUsuario(globales.usuarioLogueado.id_usu).toPromise().then(resp => {
        //   resp.forEach(cm => {
        //     comunidadesIDs.push(cm.id_com);
        //   });
        // })
        // await this.comunidadesService.GetComunidadesByIdArray(comunidadesIDs).toPromise().then(resp => {
        //   resp.forEach(comunidad => {
        //     this.todosComunidades.push(comunidad)
        //   })
        });
        console.log(idsComunidades);

        idsComunidades.forEach(comunidad => {
          this.comunidadesService.GetComunidadById(comunidad.id_com).toPromise().then(resp => {
            this.todosComunidades.push(resp)
          })
          
          console.log(comunidad);
        })
        console.log(this.todosComunidades);

        this.loadingFlag = false;
      }
      this.comunidadesFiltrados = this.todosComunidades;
    }
  }

  irAComunidad(comunidad: Comunidad) {
    return `usuario/comunidad/${comunidad.id_com}`
  }

  filtrarIdiomas(v: string) {
    return this.todosComunidades.filter(x => x.nombre.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

}
