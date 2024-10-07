import { CachorrosComponent } from './components/cachorros/cachorros.component';
import { EjemplaresComponent } from './components/ejemplares/ejemplares.component';
import { CamadasComponent } from './components/camadas/camadas.component';
import { Routes } from '@angular/router';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { EjemplaresDashboardComponent } from './components/ejemplares/ejemplares-dashboard/ejemplares-dashboard.component';
import { CachorrosDashboardComponent } from './components/cachorros/cachorros-dashboard/cachorros-dashboard.component';


export const routes: Routes = [
  { path: 'ejemplares', component: EjemplaresComponent },
  { path: 'ejemplares/:nombre', component: EjemplaresDashboardComponent }, // Ruta con parámetro 'nombre'
  { path: '', redirectTo: '/ejemplares', pathMatch: 'full' },
  { path: 'cachorros', component: CachorrosComponent},
  { path: 'cachorros/:nombre', component: CachorrosDashboardComponent},
  { path: 'camadas', component: CamadasComponent },
  { path: 'detalle-cachorro/:id', component: CachorrosComponent },
  { path: 'novedades', component: NovedadesComponent },
  { path: '', redirectTo: '/novedades', pathMatch: 'full' }
];