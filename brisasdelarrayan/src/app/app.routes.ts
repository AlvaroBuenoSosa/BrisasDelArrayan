import { CachorrosComponent } from './components/cachorros/cachorros.component';
import { EjemplaresComponent } from './components/ejemplares/ejemplares.component';
import { CamadasComponent } from './components/camadas/camadas.component';
import { Routes } from '@angular/router';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { VikingComponent } from './components/ejemplares/Viking/viking.component';
import { ViniComponent } from './components/ejemplares/vini/vini.component';


export const routes: Routes = [
  { path: 'ejemplares', component: EjemplaresComponent },
  { path: 'ejemplares/:viking', component: VikingComponent },
  { path: 'ejemplares/:vini', component: ViniComponent },
  { 
    path: 'cachorros', 
    component: CachorrosComponent,
    children: [
      { path: ':nombre', component: CachorrosComponent }
    ]
  },
  { path: 'camadas', component: CamadasComponent },
  { path: 'novedades', component: NovedadesComponent },
  { path: '', redirectTo: '/novedades', pathMatch: 'full' }
];