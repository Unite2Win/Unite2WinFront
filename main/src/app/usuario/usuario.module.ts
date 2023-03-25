import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioRoutes } from './usuario.routing';
import { InicioComponent } from './inicio/inicio.component';
import { ObjetivosComponent } from './objetivos/objetivos.component';
import { PlanesComponent } from './planes/planes.component';
import { ComunidadesComponent } from './comunidades/comunidades.component';
import { PerfilComponent } from './perfil/perfil.component';



@NgModule({
  declarations: [
    InicioComponent,
    ObjetivosComponent,
    PlanesComponent,
    ComunidadesComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UsuarioRoutes)
  ]
})
export class UsuarioModule { }
