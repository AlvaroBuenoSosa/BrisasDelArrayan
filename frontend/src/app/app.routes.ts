import { Routes } from '@angular/router';

import { EjemplaresPageComponent } from './features/ejemplares/pages/ejemplares-page/ejemplares-page.component';

import { EjemplarDetailPageComponent } from './features/ejemplares/pages/ejemplar-detail-page/ejemplar-detail-page.component';

import { CachorrosPageComponent } from './features/cachorros/pages/cachorros-page/cachorros-page.component';

import { CachorroDetailPageComponent } from './features/cachorros/pages/cachorro-detail-page/cachorro-detail-page.component';

import { CamadasPageComponent } from './features/camadas/pages/camada-pages/camada-page.component';

import { CachorrosPorCamadaPageComponent } from './features/cachorros/pages/cachorro-por-camada-page/cachorros-por-camada-page.component';

import { AdminComponent } from './features/admin/pages/admin-page/admin.component';

export const routes: Routes = [

  {
    path: '',
    component: EjemplaresPageComponent
  },

  {
    path: 'ejemplares',
    component: EjemplaresPageComponent
  },

  {
    path: 'ejemplares/:slug',
    component: EjemplarDetailPageComponent
  },

  {
    path: 'cachorros',
    component: CachorrosPageComponent
  },

  {
    path: 'cachorros/:slug',
    component: CachorroDetailPageComponent
  },

  {
    path: 'camadas',
    component: CamadasPageComponent
  },

  {
    path: 'cachorros-por-camada/:id',
    component: CachorrosPorCamadaPageComponent
  },

  {
    path: 'admin',
    component: AdminComponent
  },

  {
    path: '**',
    redirectTo: ''
  }
];