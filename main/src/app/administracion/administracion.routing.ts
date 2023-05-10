import { Routes } from '@angular/router';
import { NotfoundComponent } from 'app/authentication/404/not-found.component';
import { AdminComunidadesComponent } from './admin-comunidades/admin-comunidades.component';

export const AdministracionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '404',
        component: NotfoundComponent
      },
      {
        path: 'comunidades',
        component: AdminComunidadesComponent
      }
    ]
  }
];
