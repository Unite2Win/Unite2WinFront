import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioRoutes } from './usuario.routing';
import { InicioComponent } from './inicio/inicio.component';
import { ObjetivosComponent } from './objetivos/objetivos.component';
import { PlanesComponent } from './planes/planes.component';
import { ComunidadesComponent } from './comunidades/comunidades.component';
import { PerfilComponent } from './perfil/perfil.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ConfiguracionComponent } from './configuracion/configuracion.component';



@NgModule({
  declarations: [
    InicioComponent,
    ObjetivosComponent,
    PlanesComponent,
    ComunidadesComponent,
    PerfilComponent,
    ConfiguracionComponent
  ],
  imports: [
    NgxChartsModule,
    NgApexchartsModule,
    CommonModule,
    RouterModule.forChild(UsuarioRoutes)
  ]
})
export class UsuarioModule { }
