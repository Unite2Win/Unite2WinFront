import { Component, Input, OnInit } from '@angular/core';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { Evento } from 'app/usuario/interfaces/eventoModel';
import { EventosService } from 'app/usuario/services/eventos.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  @Input() comunidadActual: Comunidad;

  loadingFlag: boolean = true;

  eventosTotales: number = 0;

  eventosAMostrar: Evento[] = [];

  // Usamos esta variable para ver que carga ha sido la ultima
  // Un 7 es la de 7 días, un 30 la de 30 días y un 365 la de 365 días
  // Esto de arriba seguiria aplicando pasemos el numero de días que pasemos al método
  // Los casos especiales son:
  // un -1 es la carga de 'En curso' y un -2 es la carga de 'Todos'
  ultimosDiasCargados: number = 0;

  error404NotFound: boolean = false;

  textoParaCriterioBusqueda: string = 'Eventos de los próximos 7 diás:'

  constructor(private eventosServce: EventosService) { }

  async ngOnInit(): Promise<void> {
    await this.eventosServce.GetEventosCountPorComunidad(this.comunidadActual.id_com).toPromise().then(resp => {
      this.eventosTotales = resp
    })
    await this.cargarProximosXDiasAsync(7);
    this.loadingFlag = false;
  }

  cargarProximosXDias(dias: number) {
    if (dias === this.ultimosDiasCargados) { return; }
    this.error404NotFound = false;
    this.eventosAMostrar = [];
    this.ultimosDiasCargados = dias;
    this.eventosServce.GetProximosXDias(dias, this.comunidadActual.id_com).toPromise().then(resp => {
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
    await this.eventosServce.GetProximosXDias(dias, this.comunidadActual.id_com).toPromise().then(resp => {
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
    this.eventosServce.GetEventosEnCurso(this.comunidadActual.id_com).toPromise().then(resp => {
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
    this.eventosServce.GetEventosPorComunidad(this.comunidadActual.id_com).toPromise().then(resp => {
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

}
