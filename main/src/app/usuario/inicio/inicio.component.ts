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
    if (this.objetivos.length == 0) {
      this.ObjetivosTitulo = 'Aun no hay objetivos';
      this.TextoBoton = 'Crear objetivos';
    } else if (this.objetivos.length > 2) {
      this.objetivos = this.objetivos.slice(0, 2);
    };
  }

  irObjetivos() {
    this.router.navigate(['/usuario/objetivos']);
  }

  getProgressBarValue(objetivo: Objetivo): number {
    const fechaString = objetivo.create_date;
    const fecha = new Date(fechaString);
    const diferenciaEnDias = Math.floor((new Date().getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
    let progreso = (diferenciaEnDias / objetivo.duracion) * 100;
    progreso = Math.min(progreso, 100); // Para que no supere el 100%
    if (progreso === 100) { //Aqui se comprueba si esta ya al 100% el objetivo para modificarlo en la bd
      objetivo.complete_date = new Date();
    }
    return progreso;
    
  }

}
