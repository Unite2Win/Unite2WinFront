import { Routes } from '@angular/router';
import { ComunidadesComponent } from './comunidades/comunidades.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { InicioComponent } from './inicio/inicio.component';
import { ObjetivosComponent } from './objetivos/objetivos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PlanesComponent } from './planes/planes.component';
import { VerComunidadUnicaComponent } from './ver-comunidad-unica/ver-comunidad-unica.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';

export const UsuarioRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        data: {
          title: 'Inicio',
          urls: [{ title: 'Inicio', url: '/usuario' }, { title: 'Inicio' }]
        }
      },
      {
        path: 'inicio',
        component: InicioComponent,
        data: {
          title: 'Inicio',
          urls: [{ title: 'Inicio', url: '/usuario' }, { title: 'Inicio' }]
        }
      },
      {
        path: 'objetivos',
        component: ObjetivosComponent,
        data: {
          title: 'Mis Objetivos',
          urls: [{ title: 'Mis Objetivos', url: '/usuario' }, { title: 'Mis Objetivos' }]
        }
      },
      {
        path: 'eventos',
        component: PlanesComponent,
        data: {
          title: 'Mis Eventos',
          urls: [{ title: 'Mis Eventos', url: '/usuario' }, { title: 'Mis Eventos' }]
        }
      },
      {
        path: 'miscomunidades',
        component: ComunidadesComponent,
        data: {
          title: 'Mis Comunidades',
          urls: [{ title: 'Mis Comunidades', url: '/usuario' }, { title: 'Mis Comunidades' }]
        }
      },
      {
        path: 'chatgpt',
        component: CustomerSupportComponent,
        data: {
          title: 'Chat GPT',
          urls: [{ title: 'Chat GPT', url: '/usuario' }, { title: 'Chat GPT' }]
        }
      },
      {
        path: 'comunidad/:id',
        component: VerComunidadUnicaComponent,
        data: {
          title: 'Comunidad',
          urls: [{ title: 'Comunidad', url: '/usuario' }, { title: 'Comunidad' }]
        }
      },
      {
        path: 'perfil',
        component: PerfilComponent,
        data: {
          title: 'Mi Perfil',
          urls: [{ title: 'Mi Perfil', url: '/usuario' }, { title: 'Mi Perfil' }]
        }
      },
      {
        path: 'configuracion',
        component: ConfiguracionComponent,
        data: {
          title: 'Mi Configuración',
          urls: [{ title: 'Mi Configuración', url: '/usuario' }, { title: 'Mi Configuración' }]
        }
      },
    ]
  }
];

// {
//   path: '',
//   children: [
//     {
//       path: 'inicio',
//       component: InicioComponent,
//       data: {
//         title: 'Modern Inicio',
//         urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Inicio' }]
//       }
//     }
//   ]
// }