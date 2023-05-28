import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VentanaConfirmacionService } from 'app/administracion/ventana-confirmacion/ventana-confirmacion.service';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { Documento } from 'app/usuario/interfaces/documentoModel';
import { Evento } from 'app/usuario/interfaces/eventoModel';
import { DocumentosService } from 'app/usuario/services/documentos.service';
import { EventosService } from 'app/usuario/services/eventos.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ComunidadEventosService {

  eventoSeleccionadoAEditar: Evento;

  docImagen: Documento;
  docImagenEditado: Documento;

  miFormEventosGlobal: FormGroup;

  comunidadActual: Comunidad;

  constructor(private dp: DatePipe, private ventanaConfirmacionService: VentanaConfirmacionService, private documentosService: DocumentosService, private toastrService: ToastrService, private modalService: NgbModal, private eventosService: EventosService, private fb: FormBuilder) { }

  crearOEditarEvento(modal: string, size: string, evento: Evento, miFormEventos: FormGroup, docIMG: Documento, comunidad: Comunidad) {
    this.docImagen = docIMG;
    miFormEventos.reset();
    this.miFormEventosGlobal = miFormEventos;
    this.eventoSeleccionadoAEditar = evento;
    this.comunidadActual = comunidad;

    miFormEventos.get("titulo").setValue(evento.titulo);
    miFormEventos.get("descripcion").setValue(evento.descripcion);
    miFormEventos.get("ubicacion").setValue(evento.ubicacion);

    // this.defaultDateInico.setDate((new Date()).getDate() + 200);
    // this.defaultDateFin.setDate((new Date()).getDate() + 200);

    //AQUI PONER EL RESTO DE CAMPOS (falta el que cargue las fechas)

    this.openModal(modal, size);
  }

  parsearFechaPrimeNG(campo: string) {
    return this.dp.transform(this.miFormEventosGlobal.get(campo).value, 'yyyy-MM-dd');
  }

  parsearHoraPrimeNG(campo: string) {
    let hora = this.dp.transform(this.miFormEventosGlobal.get(campo).value, 'HH:mm:ss');
    return hora.slice(0, hora.length - 2)
  }

  async crearOEditar() {
    if (this.miFormEventosGlobal.invalid || this.miFormEventosGlobal.untouched) {
      return;
    }

    var eventoAEditar: Evento = {
      id_evento: 0,
      id_com: this.comunidadActual.id_com,
      titulo: this.miFormEventosGlobal.get("titulo").value,
      fechaInicio: `${this.parsearFechaPrimeNG('fechaInicio')}T${this.parsearHoraPrimeNG('fechaInicio')}00.0000000`,
      fechaFin: `${this.parsearFechaPrimeNG('fechaFin')}T${this.parsearHoraPrimeNG('fechaFin')}00.0000000`,
      asistentes: 0,
      descripcion: this.miFormEventosGlobal.get('descripcion').value,
      ubicacion: this.miFormEventosGlobal.get('ubicacion').value,
    };

    if (new Date(this.miFormEventosGlobal.get('fechaInicio').value) > new Date(this.miFormEventosGlobal.get('fechaFin').value)) {
      this.toastrService.warning('La fecha de inicio no puede ser posterior a la fecha de fin')
      return;
    }

    if (this.miFormEventosGlobal.get('imagen').touched && this.docImagen != null) {
      console.log('Edito imagen');
      //AQUI HAY QUE AÑADIR EL PICTURE
      this.docImagenEditado = await this.documentosService.postDocumento(this.docImagen).toPromise()
      eventoAEditar.imagenid_doc = this.docImagenEditado.id_doc;
    } else {
      if (this.eventoSeleccionadoAEditar.imagen != null) {
        eventoAEditar.imagenid_doc = this.eventoSeleccionadoAEditar.imagen.id_doc;
      }
    }

    console.log(eventoAEditar);

    await this.eventosService.PutEventoIdBBDD(this.eventoSeleccionadoAEditar.id_com, eventoAEditar).toPromise().then(resp => {
      console.log(resp);
    });
    this.toastrService.success('El evento ha sido actualizado')
    this.closeBtnClick();

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
