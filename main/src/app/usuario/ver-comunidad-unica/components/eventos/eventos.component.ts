import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { DecodedBase64 } from 'app/usuario/interfaces/decodedBase64Model';
import { Documento } from 'app/usuario/interfaces/documentoModel';
import { Evento } from 'app/usuario/interfaces/eventoModel';
import { EventosService } from 'app/usuario/services/eventos.service';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DocumentosService } from 'app/usuario/services/documentos.service';
import { VentanaConfirmacionService } from 'app/administracion/ventana-confirmacion/ventana-confirmacion.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  @Input() comunidadActual: Comunidad;

  miFormEventos: FormGroup = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    ubicacion: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    imagen: ['']
  });

  // miFormEventos: FormGroup = this.fb.group({
  //   titulo: [''],
  //   descripcion: [''],
  //   ubicacion: [''],
  //   fechaInicio: [''],
  //   fechaFin: [''],
  //   imagen: ['']
  // });

  loadingFlag: boolean = true;

  eventosTotales: number = 0;

  eventosAMostrar: Evento[] = [];

  eventoSeleccionadoAEditar: Evento;

  // Usamos esta variable para ver que carga ha sido la ultima
  // Un 7 es la de 7 días, un 30 la de 30 días y un 365 la de 365 días
  // Esto de arriba seguiria aplicando pasemos el numero de días que pasemos al método
  // Los casos especiales son:
  // un -1 es la carga de 'En curso' y un -2 es la carga de 'Todos'
  ultimosDiasCargados: number = 0;

  error404NotFound: boolean = false;

  textoParaCriterioBusqueda: string = 'Eventos de los próximos 7 diás:'

  docImagen: Documento;
  docImagenEditado: Documento;

  minDate: Date = new Date();
  minDateFin: Date = new Date();
  defaultDateInico: Date = new Date();
  defaultDateFin: Date = new Date();

  constructor(private dp: DatePipe, private ventanaConfirmacionService: VentanaConfirmacionService, private documentosService: DocumentosService, private toastrService: ToastrService, private modalService: NgbModal, private eventosService: EventosService, private fb: FormBuilder) { }

  async ngOnInit(): Promise<void> {
    await this.eventosService.GetEventosCountPorComunidad(this.comunidadActual.id_com).toPromise().then(resp => {
      this.eventosTotales = resp
    })
    await this.cargarProximosXDiasAsync(7);

    this.minDateFin.setDate((new Date()).getDate() + 1);

    this.loadingFlag = false;
  }

  cargarProximosXDias(dias: number) {
    if (dias === this.ultimosDiasCargados) { return; }
    this.error404NotFound = false;
    this.eventosAMostrar = [];
    this.ultimosDiasCargados = dias;
    this.eventosService.GetProximosXDias(dias, this.comunidadActual.id_com).toPromise().then(resp => {
      this.eventosAMostrar = resp;
      this.textoParaCriterioBusqueda = 'Eventos para los próximos ' + dias + ' días:';
    }, (error) => {
      this.error404NotFound = true;
      this.textoParaCriterioBusqueda = 'No hay eventos disponibles con el criterio seleccionado.';
      console.log('Este error debe salir si no hay eventos en los dias señalados');
    });
  }

  async cargarProximosXDiasAsync(dias: number) {
    this.error404NotFound = false;
    this.eventosAMostrar = [];
    this.ultimosDiasCargados = dias;
    await this.eventosService.GetProximosXDias(dias, this.comunidadActual.id_com).toPromise().then(resp => {
      this.eventosAMostrar = resp;
      this.textoParaCriterioBusqueda = 'Eventos para los próximos ' + dias + ' días:';
    }, (error) => {
      this.error404NotFound = true;
      this.textoParaCriterioBusqueda = 'No hay eventos disponibles con el criterio seleccionado.';
      console.log('Este error debe salir si no hay eventos en los dias señalados');
    });
  }

  cargarEventosEnCurso() {
    if (-1 === this.ultimosDiasCargados) { return; }
    this.error404NotFound = false;
    this.eventosAMostrar = [];
    this.ultimosDiasCargados = -1;
    this.eventosService.GetEventosEnCurso(this.comunidadActual.id_com).toPromise().then(resp => {
      this.eventosAMostrar = resp;
      this.textoParaCriterioBusqueda = 'Eventos en curso actualmente:';
    }, (error) => {
      this.error404NotFound = true;
      this.textoParaCriterioBusqueda = 'No hay eventos disponibles con el criterio seleccionado.';
      console.log('Este error debe salir si no hay eventos en curso');
    });
  }

  cargarTodosEventosPorComunidad() {
    if (-2 === this.ultimosDiasCargados) { return; }
    this.error404NotFound = false;
    this.eventosAMostrar = [];
    this.ultimosDiasCargados = -2;
    this.eventosService.GetEventosPorComunidad(this.comunidadActual.id_com).toPromise().then(resp => {
      if (resp.length <= 0) {
        this.error404NotFound = true;
        this.textoParaCriterioBusqueda = 'No hay eventos disponibles con el criterio seleccionado.';
        console.log('Este mensaje debe salir si no hay eventos en general para esta comunidad');
        return;
      }
      this.eventosAMostrar = resp;
      this.textoParaCriterioBusqueda = 'Todos los eventos disponibles:';
    });
  }

  manejarEvento(eventData: any) {
    const parameter1 = eventData.param1;
    const parameter2 = eventData.param2;
    const parameter3 = eventData.param3;
    this.crearOEditarEvento(parameter1, parameter2, parameter3);
  }

  crearOEditarEvento(modal: string, size: string, evento: Evento) {
    this.docImagen = null;
    this.miFormEventos.reset();
    this.eventoSeleccionadoAEditar = evento;

    if (evento != null) {
      this.miFormEventos.get("titulo").setValue(evento.titulo);
      this.miFormEventos.get("descripcion").setValue(evento.descripcion);
      this.miFormEventos.get("ubicacion").setValue(evento.ubicacion);
      this.miFormEventos.get("fechaInicio").setValue(evento.fechaInicio);
      this.miFormEventos.get("fechaFin").setValue(evento.fechaFin);

      // this.defaultDateInico.setDate((new Date()).getDate() + 200);
      // this.defaultDateFin.setDate((new Date()).getDate() + 200);
      

      //AQUI PONER EL RESTO DE CAMPOS (falta el que cargue las fechas)
    }

    this.openModal(modal, size);
  }

  parsearFechaPrimeNG(campo: string) {
    return this.dp.transform(this.miFormEventos.get(campo).value, 'yyyy-MM-dd');
  }

  parsearHoraPrimeNG(campo: string) {
    let hora = this.dp.transform(this.miFormEventos.get(campo).value,  'HH:mm:ss');
    return hora.slice(0, hora.length-2)
  }

  async crearOEditar() {
    if (this.miFormEventos.invalid || this.miFormEventos.untouched) {
      return;
    }

    if (this.eventoSeleccionadoAEditar == null) {

      var nuevoEvento: Evento = {
        id_evento: 0,
        id_com: this.comunidadActual.id_com,
        titulo: this.miFormEventos.get("titulo").value,
        fechaInicio: `${this.parsearFechaPrimeNG('fechaInicio')}T${this.parsearHoraPrimeNG('fechaInicio')}00.0000000`,
        fechaFin: `${this.parsearFechaPrimeNG('fechaFin')}T${this.parsearHoraPrimeNG('fechaFin')}00.0000000`,
        asistentes: 0,
        descripcion: this.miFormEventos.get('descripcion').value,
        ubicacion: this.miFormEventos.get('ubicacion').value,
        imagen: this.docImagen
      };

      if (new Date(this.miFormEventos.get('fechaInicio').value) > new Date(this.miFormEventos.get('fechaFin').value)) {
        this.toastrService.warning('La fecha de inicio no puede ser posterior a la fecha de fin')
        return;
      }

      await this.eventosService.PostEventoBBDD(nuevoEvento).toPromise().then();
      this.toastrService.success('El evento ha sido creado')
      this.closeBtnClick();

    } else {

      var eventoAEditar: Evento = {
        id_evento: this.eventoSeleccionadoAEditar.id_evento,
        id_com: this.comunidadActual.id_com,
        titulo: this.miFormEventos.get("titulo").value,
        fechaInicio: `${this.parsearFechaPrimeNG('fechaInicio')}T${this.parsearHoraPrimeNG('fechaInicio')}00.0000000`,
        fechaFin: `${this.parsearFechaPrimeNG('fechaFin')}T${this.parsearHoraPrimeNG('fechaFin')}00.0000000`,
        asistentes: 0,
        descripcion: this.miFormEventos.get('descripcion').value,
        ubicacion: this.miFormEventos.get('ubicacion').value,
      };

      if (new Date(this.miFormEventos.get('fechaInicio').value) > new Date(this.miFormEventos.get('fechaFin').value)) {
        this.toastrService.warning('La fecha de inicio no puede ser posterior a la fecha de fin')
        return;
      }

      if (this.miFormEventos.get('imagen').touched && this.docImagen != null) {
        console.log('Edito imagen');
        this.docImagenEditado = await this.documentosService.postDocumento(this.docImagen).toPromise()
        eventoAEditar.imagenid_doc = this.docImagenEditado.id_doc;
      } else {
        if (this.eventoSeleccionadoAEditar.imagen != null) {
          eventoAEditar.imagenid_doc = this.eventoSeleccionadoAEditar.imagen.id_doc;
        }
      }

      //DESPUES DE EDITAR SI LO HEMOS HECHO DESDE UN BOTÓN QUE NO ES EL DEFAULT SE QUEDA CLICKADO EL OTRO PERO CARGA EL DEFAULT :(

      await this.eventosService.PutEventoIdBBDD(this.eventoSeleccionadoAEditar.id_evento, eventoAEditar).toPromise().then(resp => {
        console.log(resp);
      });
      this.toastrService.success('El evento ha sido actualizado')
      this.closeBtnClick();
    }

  }

  async eliminarComunidad(evento: Evento) {
    this.eventoSeleccionadoAEditar = evento;

    let flag: boolean = false;

    await this.ventanaConfirmacionService.confirmar('¡Alerta!', `¿Seguro que desea borrar el evento?`)
      .then((confirmado) => flag = confirmado)
      .catch(() => console.log('El usuario ha cerrado la ventana (ej., usando ESC, clickando en la X o pulsando fuera de la ventana)'));

    if (!flag) {
      return;
    }

    await this.eventosService.DeleteEventoBBDD(this.eventoSeleccionadoAEditar.id_com, this.eventoSeleccionadoAEditar).toPromise().then();
    this.toastrService.success('El evento ha sido eliminado')
    this.closeBtnClick();
  }

  async fileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = target.files[0];
    if (file) {
      await this.file2Base64(file).then(
        (res) => {
          this.docImagen = {
            id_doc: 0,
            data: res.data,
            descripcion: res.descripcion,
            extensionArchivo: res.fileExtension
          };
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
    this.ngOnInit();
  }

}
