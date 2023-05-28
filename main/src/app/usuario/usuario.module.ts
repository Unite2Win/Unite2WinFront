import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { QRCodeModule } from 'angularx-qrcode';
import { TarjetaUsuarioComponent } from './ver-comunidad-unica/components/personas/tarjeta-usuario/tarjeta-usuario.component';
import { ExplorarComponent } from './explorar/explorar.component';
import { TarjetaEventoComponent } from './ver-comunidad-unica/components/eventos/tarjeta-evento/tarjeta-evento.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { CalendarModule } from 'primeng/calendar';
import { TarjetaPostComponent } from './ver-comunidad-unica/components/feed/tarjeta-post/tarjeta-post.component';
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
    CustomerSupportComponent,
    TarjetaUsuarioComponent,
    ExplorarComponent,
    TarjetaEventoComponent,
    TarjetaPostComponent,
  ],
  imports: [
    FormsModule, 
    ReactiveFormsModule,
    CalendarModule,
    TabMenuModule,
    TooltipModule,
    SpeedDialModule,
    NgxChartsModule,
    NgApexchartsModule,
    CommonModule,
    RouterModule.forChild(UsuarioRoutes),
    PipesModule,
    FormsModule,
    NgbModule,
    FeatherModule,
    QRCodeModule
  ],
  providers: [DatePipe],
})
export class UsuarioModule { }
