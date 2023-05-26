import { Component, OnInit } from '@angular/core';
import { Objetivo } from '../interfaces/objetivo';
import { ObjetivosService } from '../services/objetivos.service';
import { globales } from 'common/globales';
import { Usuario } from '../interfaces/usuarioModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  objetivo: Objetivo;
  objetivos: Objetivo[] = [];
  ObjetivosTitulo: String = 'Objetivos Activos:';
  TextoBoton: String = 'Ver todos los objetivos';
  globales: globales;
  usuario: Usuario = globales.usuarioLogueado;

  constructor(private objetivosService: ObjetivosService, private router: Router) { }

  async ngOnInit() {
    await this.objetivosService.getObjetivos();
    this.objetivos = this.objetivosService.objetivosBd;
    console.log(this.objetivos.length);
    if (this.objetivos.length == 0) {
      this.ObjetivosTitulo = 'Aun no hay objetivos';
      this.TextoBoton = 'Crear objetivos';
    };
  }

  irObjetivos() {
    this.router.navigate(['/usuario/objetivos']);
  }

}
