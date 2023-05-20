import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComunidadesComponent } from './admin-comunidades/admin-comunidades.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdministracionRoutes } from './administracion.routing';
import { FeatherModule } from 'angular-feather';
import { VentanaConfirmacionComponent } from './ventana-confirmacion/ventana-confirmacion.component';



@NgModule({
  declarations: [
    AdminComunidadesComponent,
    VentanaConfirmacionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdministracionRoutes),
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    FeatherModule
  ]
})
export class AdministracionModule { }