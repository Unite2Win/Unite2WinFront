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
import { VentanaConfirmacionService } from '../ventana-confirmacion/ventana-confirmacion.service';
import { DocumentosService } from 'app/usuario/services/documentos.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'app/usuario/interfaces/usuarioModel';
import { UsuariosService } from 'app/usuario/services/usuarios.service';

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

  addSearchUsuarios: Usuario[] = [];

  criterioBusquedaUsuarioBBDD: string = '';

  mensajeFalloBusqueda: string = 'Pruebe a buscar usuarios.'

  isLoadingAddUser: boolean = false;

  //ESTO ES PARA LOS MODALES DE EDICION, CREADO Y BORRADO
  miFormComunidades: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    clave: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    banner: [''],
    picture: [''],
    isVisible: [true, Validators.required],
    isPublica: [true, Validators.required]
  });

  comunidadesOBJ: Comunidad[] = [];
  comunidadesDescripcion: String[] = [];

  selectedComBorrar: String;
  selectedComEditar: String;

  mensajeModalDelete: string = ""
  tituloModalDelete: string = ""

  docPicture: Documento = null;
  docBanner: Documento = null;
  docPictureEditado: Documento = null;
  docBannerEditado: Documento = null;
  ///////////////////////////////////////////////////

  constructor(private usuariosService: UsuariosService, private documentosService: DocumentosService, private ventanaConfirmacionService: VentanaConfirmacionService, private loginService: LoginService, private modalService: NgbModal, private fb: FormBuilder, private comunidadesService: ComunidadesService, private toastrService: ToastrService) { }

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
        });
        this.loadingFlag = false;
      }
      this.comunidadesFiltrados = this.todosComunidades;
    }
  }

  mostrarFormulario() {
    console.log(this.miFormComunidades.value);
  }

  filtrarIdiomas(v: string) {
    return this.todosComunidades.filter(x => x.nombre.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

  //ESTO ES PARA LOS MODALES DE EDICION, CREADO Y BORRADO
  crearOEditarComunidad(modal: string, size: string, comunidad: Comunidad) {
    this.docPicture = null;
    this.docBanner = null;
    this.docPictureEditado = null;
    this.docBannerEditado = null;
    this.comunidadSeleccionado = comunidad;
    this.miFormComunidades.reset();

    if (this.comunidadSeleccionado != null) {
      this.miFormComunidades.get("nombre").setValue(this.comunidadSeleccionado.nombre);
      this.miFormComunidades.get("descripcion").setValue(this.comunidadSeleccionado.descripcion);
      this.miFormComunidades.get("clave").setValue(this.comunidadSeleccionado.clave);
      this.miFormComunidades.get("isVisible").setValue(this.comunidadSeleccionado.isVisible);
      this.miFormComunidades.get("isPublica").setValue(this.comunidadSeleccionado.isPublica);
    }

    this.openModal(modal, size);
  }

  async crearOEditar() {
    if (this.miFormComunidades.invalid || this.miFormComunidades.untouched) {
      return;
    }

    if (this.comunidadSeleccionado == null) {

      var nuevaComunidad: Comunidad = {
        id_com: 0,
        nombre: this.miFormComunidades.get("nombre").value,
        descripcion: this.miFormComunidades.get("descripcion").value,
        clave: this.miFormComunidades.get("clave").value,
        banner: this.docBanner,
        picture: this.docPicture,
        isVisible: this.miFormComunidades.get("isVisible").value,
        isPublica: this.miFormComunidades.get("isPublica").value
      };

      await this.comunidadesService.PostComunidadBBDD(nuevaComunidad).toPromise().then();
      this.toastrService.success('La comunidad ha sido creada')
      this.closeBtnClick();

    } else {


      var comunidadAEditar: Comunidad = {
        id_com: this.comunidadSeleccionado.id_com,
        nombre: this.miFormComunidades.get("nombre").value,
        descripcion: this.miFormComunidades.get("descripcion").value,
        clave: this.miFormComunidades.get("clave").value,
        create_date: this.comunidadSeleccionado.create_date,
        last_modified: this.comunidadSeleccionado.last_modified,
        delete_date: this.comunidadSeleccionado.delete_date,
        isVisible: this.miFormComunidades.get("isVisible").value,
        isPublica: this.miFormComunidades.get("isPublica").value
      };

      if (this.miFormComunidades.get('picture').touched && this.docPicture != null) {
        console.log('Edito picture');
        //AQUI HAY QUE AÑADIR EL PICTURE
        this.docPictureEditado = await this.documentosService.postDocumento(this.docPicture).toPromise()
        comunidadAEditar.pictureid_doc = this.docPictureEditado.id_doc;
      } else {
        if (this.comunidadSeleccionado.picture != null) {
          comunidadAEditar.pictureid_doc = this.comunidadSeleccionado.picture.id_doc;
        }
      }

      if (this.miFormComunidades.get('banner').touched && this.docBanner != null) {
        console.log('Edito banner');
        //AQUI HAY QUE AÑADIR EL BANNER
        this.docBannerEditado = await this.documentosService.postDocumento(this.docBanner).toPromise()
        comunidadAEditar.bannerid_doc = this.docBannerEditado.id_doc;
      } else {
        if (this.comunidadSeleccionado.banner != null) {
          comunidadAEditar.bannerid_doc = this.comunidadSeleccionado.banner.id_doc;
        }
      }

      await this.comunidadesService.PutComunidadIdBBDD(this.comunidadSeleccionado.id_com, comunidadAEditar).toPromise().then(resp => {
      });
      this.toastrService.success('La comunidad ha sido actualizada')
      this.closeBtnClick();
    }

  }

  async eliminarComunidad(comunidad: Comunidad) {
    this.comunidadSeleccionado = comunidad;

    let flag: boolean = false;

    await this.ventanaConfirmacionService.confirmar('Borrar comunidad', `¿Seguro que desea borrar la comunidad "${comunidad.nombre}"?`)
      .then((confirmado) => flag = confirmado)
      .catch(() => console.log('El usuario ha cerrado la ventana (ej., usando ESC, clickando en la X o pulsando fuera de la ventana)'));

    if (!flag) {
      return;
    }

    await this.comunidadesService.DeleteComunidadBBDD(this.comunidadSeleccionado.id_com, this.comunidadSeleccionado).toPromise().then();
    this.OnPageChange(this.page)
    this.toastrService.success('La comunidad ha sido eliminada')
    this.closeBtnClick();
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
  //////////////////////////////////////////////////////////////////////////////////

  async searchUser() {
    this.isLoadingAddUser = true;
    this.addSearchUsuarios = [];
    this.mensajeFalloBusqueda = 'No hay resultados con el criterio seleccionado.';
    await this.usuariosService.GetByNick(this.criterioBusquedaUsuarioBBDD).toPromise().then(resp => {
      this.addSearchUsuarios = resp;
      console.log(this.comunidadSeleccionado);
      console.log(this.addSearchUsuarios);
    }, (error) => {
      this.toastrService.error('No hay usuarios con el criterio introducido.');
      console.log('Este error debe salir si no hay usuaris con este criterio');
    });
    this.isLoadingAddUser = false;
  }

  openModalAddUser(targetModal: string, size: string, comunidad: Comunidad) {
    this.comunidadSeleccionado = comunidad;
    this.criterioBusquedaUsuarioBBDD = '';
    this.addSearchUsuarios = [];
    this.mensajeFalloBusqueda = 'Pruebe a buscar usuarios.';
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: size
    });
  }

  closeBtnClickAddUser() {
    this.modalService.dismissAll();
    this.ngOnInit();
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
    // this.ngOnInit();
    this.OnPageChange(this.page)
    this.mostrarFormulario();
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
