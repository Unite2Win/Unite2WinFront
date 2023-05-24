import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VentanaConfirmacionComponent } from './ventana-confirmacion.component';

@Injectable({
  providedIn: 'root'
})
export class VentanaConfirmacionService {

  constructor(private modalService: NgbModal) { }

  public confirmar(
    titulo: string,
    mensaje: string,
    textoBtnOk: string = 'Confirmar',
    textoBtnCancelar: string = 'Cancelar',
    tamanioModal: 'sm' | 'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(VentanaConfirmacionComponent, {
      centered: true,
      backdrop: 'static', 
      size: tamanioModal
    });
    modalRef.componentInstance.titulo = titulo;
    modalRef.componentInstance.mensaje = mensaje;
    modalRef.componentInstance.textoBtnOk = textoBtnOk;
    modalRef.componentInstance.textoBtnCancelar = textoBtnCancelar;

    return modalRef.result;
  }

}
