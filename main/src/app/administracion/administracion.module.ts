import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComunidadesComponent } from './admin-comunidades/admin-comunidades.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdministracionRoutes } from './administracion.routing';
import { FeatherModule } from 'angular-feather';
import { VentanaConfirmacionComponent } from './ventana-confirmacion/ventana-confirmacion.component';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TarjetaUsuarioAdminComponent } from './admin-comunidades/tarjeta-usuario/tarjeta-usuario.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { PipesModule } from 'app/pipes/pipes.module';



@NgModule({
  declarations: [
    AdminComunidadesComponent,
    VentanaConfirmacionComponent,
    TarjetaUsuarioAdminComponent
  ],
  imports: [
    CommonModule,
    RadioButtonModule,
    TooltipModule,
    SpeedDialModule,
    RouterModule.forChild(AdministracionRoutes),
    NgbModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    FeatherModule
  ]
})
export class AdministracionModule { }
