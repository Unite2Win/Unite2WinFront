import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VentanaConfirmacionService } from './ventana-confirmacion.service';

@Component({
  selector: 'app-ventana-confirmacion',
  templateUrl: './ventana-confirmacion.component.html',
  styleUrls: ['./ventana-confirmacion.component.scss']
})
export class VentanaConfirmacionComponent implements OnInit {

  @Input() titulo: string;
  @Input() mensaje: string;
  @Input() textoBtnOk: string;
  @Input() textoBtnCancelar: string;

  constructor(private activeModal: NgbActiveModal, private ventanaConfirmacionService: VentanaConfirmacionService) { }

  ngOnInit() {
  }

  public rechazar() {
    this.activeModal.close(false);
  }

  public aceptar() {
    this.activeModal.close(true);
  }

  public cerrar() {
    this.activeModal.dismiss();
  }

  ////////////////////////////////////////////////////////////
  //==============================================
  // EJEMPLO PARA USAR VENTANA DE CONFIRMACIÓN (Esto es lo que se pone allá donde lo uses)
  //==============================================

  //En el constructor hay que añanir el servicio: "constructor(private ventanaConfirmacionService: VentanaConfirmacionService)"

  public abrirVentanaConfirmacion() {
    this.ventanaConfirmacionService.confirmar('Confirma por favor...', 'De verdad quieres ... ?')
      .then((confirmado) => console.log('El usuario a respondido:', confirmado))
      .catch(() => console.log('El usuario ha cerrado la ventana (usando ESC o clickando en la X)'));
  }
  
  //==============================================
  // EJEMPLO PARA USAR VENTANA DE CONFIRMACIÓN
  //==============================================
  ////////////////////////////////////////////////////////////

}
