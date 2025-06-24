import { Routes } from '@angular/router';
import { EjemplaresComponent } from './components/ejemplares/ejemplares.component';
import { CamadasComponent } from './components/camadas/camadas.component';
import { CachorrosComponent } from './components/cachorros/cachorros.component';
import { EjemplaresDashboardComponent } from './components/ejemplares/ejemplares-dashboard/ejemplares-dashboard.component';
import { CachorrosDashboardComponent } from './components/cachorros/cachorros-dashboard/cachorros-dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { CachorrosPorCamadaComponent } from './components/cachorros-por-camada/cachorros-por-camada.component';

export const appRoutes: Routes = [
  { path: 'ejemplares', component: EjemplaresComponent },
  { path: 'ejemplares/:name', component: EjemplaresDashboardComponent },
  { path: '', redirectTo: '/ejemplares', pathMatch: 'full' },
  { path: 'cachorros', component: CachorrosComponent},
  { path: 'cachorros/:nombre', component: CachorrosDashboardComponent},
  { path: 'camadas', component: CamadasComponent },
  { path: '', redirectTo: '/novedades', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'cachorros-por-camada', component: CachorrosPorCamadaComponent }
];