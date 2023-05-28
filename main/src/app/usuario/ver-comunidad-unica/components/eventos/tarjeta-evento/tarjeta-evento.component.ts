import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VentanaConfirmacionService } from 'app/administracion/ventana-confirmacion/ventana-confirmacion.service';
import { Evento } from 'app/usuario/interfaces/eventoModel';
import { EventosService } from 'app/usuario/services/eventos.service';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-tarjeta-evento',
  templateUrl: './tarjeta-evento.component.html',
  styleUrls: ['./tarjeta-evento.component.scss']
})
export class TarjetaEventoComponent implements OnInit {

  @Input() eventoActual: Evento;
  @Input() modal;
  @Output("parentOnInit") parentOnInit: EventEmitter<any> = new EventEmitter();
  @Output("parentCrearOEditar") parentCrearOEditar: EventEmitter<any> = new EventEmitter();

  tooltipItems: MenuItem[];

  constructor(private dp: DatePipe, private ventanaConfirmacionService: VentanaConfirmacionService, private eventosService: EventosService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.eventoActual.imagen

    this.tooltipItems = [
      // {
      //   tooltipOptions: {
      //     tooltipLabel: 'Unirme como asistente',
      //     tooltipPosition: 'top'
      //   },
      //   icon: 'pi pi-user-plus',
      //   command: () => {
      //     this.unirmeComoAsistente();
      //   }
      // },
      {
        tooltipOptions: {
          tooltipLabel: 'Editar evento',
          tooltipPosition: 'right'
        },
        icon: 'pi pi-pencil',
        command: () => {
          this.editarEvento();
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Eliminar evento',
          tooltipPosition: 'right'
        },
        icon: 'pi pi-trash',
        command: () => {
          this.eliminarEvento();
        }
      }
    ];

  }

  parsearFecha(fecha: string) {
    return this.dp.transform(fecha, 'dd-MM-yyyy', 'es-ES');
  }

  parsearHora(fecha: string) {
    return this.dp.transform(fecha, 'hh:mm:ss');
  }

  async eliminarEvento() {
    let flag: boolean = false;
    await this.ventanaConfirmacionService.confirmar('¡Alerta!', `¿Seguro que desea borrar el evento?`)
      .then((confirmado) => flag = confirmado)
      .catch(() => console.log('El usuario ha cerrado la ventana (ej., usando ESC, clickando en la X o pulsando fuera de la ventana)'));
    if (!flag) {
      return;
    }
    await this.eventosService.DeleteEventoBBDD(this.eventoActual.id_evento, this.eventoActual).toPromise().then();
    this.toastrService.success('El evento ha sido eliminado')
    this.parentOnInit.emit();
  }

  editarEvento() {
    this.parentCrearOEditar.emit({ param1: this.modal, param2: 'md', param3: this.eventoActual })
  }

}
