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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'app/pipes/pipes.module';
import { VerComunidadUnicaComponent } from './ver-comunidad-unica/ver-comunidad-unica.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';
import { TabMenuModule } from 'primeng/tabmenu';
import { FeedComponent } from './ver-comunidad-unica/components/feed/feed.component';
import { PersonasComponent } from './ver-comunidad-unica/components/personas/personas.component';
import { EventosComponent } from './ver-comunidad-unica/components/eventos/eventos.component';
import { MultimediaComponent } from './ver-comunidad-unica/components/multimedia/multimedia.component';
import { TooltipModule } from 'primeng/tooltip';
import { CustomerSupportComponent } from './customer-support/customer-support.component';

@NgModule({
  declarations: [
    InicioComponent,
    ObjetivosComponent,
    PlanesComponent,
    ComunidadesComponent,
    PerfilComponent,
    ConfiguracionComponent,
    VerComunidadUnicaComponent,
    FeedComponent,
    PersonasComponent,
    EventosComponent,
    MultimediaComponent,
    CustomerSupportComponent
  ],
  imports: [
    FormsModule, 
    ReactiveFormsModule,
    TabMenuModule,
    TooltipModule,
    NgxChartsModule,
    NgApexchartsModule,
    CommonModule,
    RouterModule.forChild(UsuarioRoutes),
    PipesModule,
    FormsModule,
    NgbModule,
    FeatherModule
  ]
})
export class UsuarioModule { }
