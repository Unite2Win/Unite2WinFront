import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FullComponent } from "./layouts/full/full.component";
import { BlankComponent } from "./layouts/blank/blank.component";
import { AuthGuard } from "./authentication/guards/auth.guard";
import { AdministracionModule } from './administracion/administracion.module';

export const Approutes: Routes = [
  {
    path: "",
    component: FullComponent,
    children: [
      { path: "", redirectTo: "/authentication/login", pathMatch: "full" },
      {
        path: "administracion",
        canActivate: [AuthGuard], //Estoy hay que ponerlo en las rutas que queramos securizadas con el login
        loadChildren: () =>
          import("./administracion/administracion.module").then((m) => m.AdministracionModule),
      },
      {
        path: "usuario",
        canActivate: [AuthGuard], //Estoy hay que ponerlo en las rutas que queramos securizadas con el login
        loadChildren: () =>
          import("./usuario/usuario.module").then((m) => m.UsuarioModule),
      }
    ],
  },
  {
    path: "",
    component: BlankComponent,
    children: [
      {
        path: "authentication",
        loadChildren: () =>
          import("./authentication/authentication.module").then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "/authentication/404",
  },
];
