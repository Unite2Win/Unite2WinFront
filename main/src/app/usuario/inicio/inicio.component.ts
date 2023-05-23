import { Component, OnInit } from '@angular/core';
import { Objetivo } from '../interfaces/objetivo';
import { ObjetivosService } from '../services/objetivos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  objetivo: Objetivo;
  objetivos: Objetivo[] = [];

  constructor(private objetivosService: ObjetivosService) { }
  async ngOnInit() {

    await this.objetivosService.getObjetivos();
  this.objetivos = this.objetivosService.objetivosBd;
}
}
