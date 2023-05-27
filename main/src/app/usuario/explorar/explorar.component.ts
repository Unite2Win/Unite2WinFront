import { Component, OnInit } from '@angular/core';
import { Comunidad } from '../interfaces/comunidadModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Documento } from '../interfaces/documentoModel';
import { VentanaConfirmacionService } from 'app/administracion/ventana-confirmacion/ventana-confirmacion.service';
import { LoginService } from 'app/authentication/login/login.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManejoDocsService } from '../services/manejo-docs.service';
import { ComunidadesService } from '../services/comunidades.service';
import { AdminComunidadesService } from 'app/administracion/admin-comunidades/admin-comunidades.service';
import { DecodedBase64 } from '../interfaces/decodedBase64Model';
import { ComunidadesUsuariosService } from '../services/comunidades-usuarios.service';
import { globales } from 'common/globales';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.component.html',
  styleUrls: ['./explorar.component.scss']
})
export class ExplorarComponent implements OnInit {

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

      let a = this.comunidadesService.GetComunidadesCount().toPromise()
      await a.then(count => {
        this.size = count
        if (this.size === 0) {
          this.noDataFlag = true;
        } else {
          this.noDataFlag = false;
        }
      })

      if (this.noDataFlag == false) {
        var idsComunidades
        await this.comunidadesUsuariosService.GetComunidadesUsuariosPaginadoExplorar(0, this.pageSize, this.globales.id_usu).toPromise().then(resp => {
          console.log(resp)
          idsComunidades = resp
        });
        console.log(idsComunidades);
        const arraySinDuplicados = idsComunidades.reduce((accumulator, current) => {
          const duplicate = accumulator.find(obj => obj.id_com === current.id_com);
          if (!duplicate) {
            return accumulator.concat(current);
          }
          return accumulator;
        }, []);

        arraySinDuplicados.forEach(async comunidad => {
          await this.comunidadesService.GetComunidadById(comunidad.id_com).toPromise().then(resp => {
            console.log(resp)
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

  mostrarComunidad(com: Comunidad) {
    console.log(com);
  }

  filtrarIdiomas(v: string) {
    return this.todosComunidades.filter(x => x.nombre.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

  async fileChange(event: Event, funcion: string) {
    const target = event.target as HTMLInputElement;
    const file: File = target.files[0];
    if (file) {
      await this.file2Base64(file).then(
        (res) => {
          if (funcion.toLowerCase().trim() == 'picture') {
            this.docPicture = {
              id_doc: 0,
              data: res.data,
              descripcion: res.descripcion,
              extensionArchivo: res.fileExtension
            };
          }
          else if (funcion.toLowerCase().trim() == 'banner') {
            this.docBanner = {
              id_doc: 0,
              data: res.data,
              descripcion: res.descripcion,
              extensionArchivo: res.fileExtension
            };
          }
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

  OnPageChange(event) {
    this.loadingFlag = true;
    this.actualPage = event - 1
    let a = this.comunidadesService.GetComunidadesPaginados(event - 1, this.pageSize).toPromise()
    a.then(async resp => {
      if (resp == null) {
        var a = this.comunidadesService.GetComunidadesCount().toPromise()
        await a.then(count => {
          this.size = count
        })
        this.OnPageChange(this.page)
      } else {
        var a = this.comunidadesService.GetComunidadesCount().toPromise()
        await a.then(count => {
          this.size = count
        })
        this.todosComunidades = null
        this.todosComunidades = resp
        this.comunidadesFiltrados = this.todosComunidades ///esto no está en el otro metodo
        this.loadingFlag = false;
      }
    })
  }
}