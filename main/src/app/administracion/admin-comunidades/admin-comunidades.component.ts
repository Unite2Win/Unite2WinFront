import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'app/authentication/login/login.service';
import { ComunidadesService } from 'app/usuario/services/comunidades.service';
import { ManejoDocsService } from 'app/usuario/services/manejo-docs.service';
import { AdminComunidadesService } from './admin-comunidades.service';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { Documento } from 'app/usuario/interfaces/documentoModel';
import { DecodedBase64 } from 'app/usuario/interfaces/decodedBase64Model';

@Component({
  selector: 'app-admin-comunidades',
  templateUrl: './admin-comunidades.component.html',
  styleUrls: ['./admin-comunidades.component.scss']
})
export class AdminComunidadesComponent implements OnInit {

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
  miFormComunidadesCrear: FormGroup = this.fb.group({
    descripcionIdioma: ['', Validators.required],
    codigoIdioma: ['', Validators.required],
    archivo: ['', Validators.required]
  });

  miFormComunidadesEditar: FormGroup = this.fb.group({
    identificadorIdioma: ['', Validators.required],
    archivo: ''
  });

  comunidadesOBJ: Comunidad[] = [];
  comunidadesDescripcion: String[] = [];

  selectedComBorrar: String;
  selectedComEditar: String;

  mensajeModalDelete: string = ""
  tituloModalDelete: string = ""

  docCrear: Documento = null;
  docEditar: Documento = null;
  ///////////////////////////////////////////////////

  constructor(private loginService: LoginService, private modalService: NgbModal, private fb: FormBuilder, private manejoDocsService: ManejoDocsService, private comunidadesService: ComunidadesService, private adminComunidadesService: AdminComunidadesService) { }

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
        this.size = count
        if (this.size === 0) {
          this.noDataFlag = true;
        } else {
          this.noDataFlag = false;
        }
      })

      if (this.noDataFlag == false) {
        await this.comunidadesService.GetComunidadesPaginados(0, this.pageSize).toPromise().then(resp => {
          resp.forEach(comunidad => {
            this.todosComunidades.push(comunidad)
          })
          console.log(resp);
        });
        this.loadingFlag = false;
      }
      this.comunidadesFiltrados = this.todosComunidades;
    }
  }

  filtrarIdiomas(v: string) {
    return this.todosComunidades.filter(x => x.nombre.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

  //ESTO ES PARA LOS MODALES DE EDICION, CREADO Y BORRADO
  crearComunidad(modal: string, size: string) {
    this.miFormComunidadesCrear.reset();
    this.openModal(modal, size);
  }

  async crear() {
    if (this.miFormComunidadesCrear.invalid) {
      return;
    }

    //AQUI FALTA TODA LA LOGICA PARA COGER LOS DATOS DE LA NUEVA COMUNIDAD

    var nuevaComunidad: Comunidad = {
      id_com: 0,
      nombre: '',
      descripcion: '',
      clave: '',
      create_date: undefined,
      last_modified: undefined,
      delete_date: undefined,
      banner: undefined,
      picture: undefined
    };

    await this.comunidadesService.PostComunidadBBDD(nuevaComunidad).toPromise().then();
    this.closeBtnClick();
  }

  editarComunidad(modal: string, comunidad: Comunidad) {
    this.miFormComunidadesEditar.reset();

    //AQUI HABRIA QUE RELLENAR LOS CAMPOS DEL FORMULARIO PARA EDITAR

    this.comunidadSeleccionado = comunidad;
    this.openModal(modal, 'md');
  }

  async editar() {
    if (this.miFormComunidadesEditar.invalid || this.miFormComunidadesEditar.untouched) {
      return;
    }

    //AQUI FALTA TODA LA LOGICA PARA COGER LOS DATOS DE LA COMUNIDAD A EDITAR

    var nuevaComunidad: Comunidad = {
      id_com: 0,
      nombre: '',
      descripcion: '',
      clave: '',
      create_date: undefined,
      last_modified: undefined,
      delete_date: undefined,
      banner: undefined,
      picture: undefined
    };

    await this.comunidadesService.PutComunidadIdBBDD(this.comunidadSeleccionado.id_com, nuevaComunidad).toPromise().then();
    this.closeBtnClick();
  }

  async eliminarComunidad(comunidad: Comunidad) {
    this.comunidadSeleccionado = comunidad;

    // var r = await this.notify.confirm({
    //   title: '¡Aviso!',
    //   message: '¿Seguro que desea eliminar el idioma ' + this.idiomaSeleccionado.descripcion + '?',
    //   okText: 'Confirmar',
    //   cancelText: 'Volver',
    // })

    // if (!r) {
    //   return;
    // }

    await this.comunidadesService.DeleteComunidadBBDD(this.comunidadSeleccionado.id_com, this.comunidadSeleccionado).toPromise().then();
    this.OnPageChange(this.page)
    this.closeBtnClick();
  }

  async fileChange(event: Event, funcion: string) {
    const target = event.target as HTMLInputElement;
    const file: File = target.files[0];
    if (file) {
      await this.file2Base64(file).then(
        (res) => {
          if (funcion.toLowerCase().trim() == 'crear') {
            this.docCrear = {
              id_doc: 0,
              data: res.data,
              descripcion: res.descripcion,
              extensionArchivo: res.fileExtension
            };
          }
          else if (funcion.toLowerCase().trim() == 'editar') {
            this.docEditar = {
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
  //////////////////////////////////////////////////////////////////////////////////

  openModal(targetModal: string, size: string) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: size
    });
  }

  closeBtnClick() {
    this.modalService.dismissAll();
    // this.ngOnInit();
    this.OnPageChange(this.page)
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
