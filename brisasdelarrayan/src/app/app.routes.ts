import { CachorrosComponent } from './components/cachorros/cachorros.component';
import { EjemplaresComponent } from './components/ejemplares/ejemplares.component';
import { CamadasComponent } from './components/camadas/camadas.component';
import { Routes } from '@angular/router';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { VikingComponent } from './components/ejemplares/Viking/viking.component';
import { ViniComponent } from './components/ejemplares/vini/vini.component';
import { FortunaComponent } from './components/ejemplares/fortuna/fortuna.component';
import { CarmelaComponent } from './components/ejemplares/carmela/carmela.component';


export const routes: Routes = [
  { path: 'ejemplares', component: EjemplaresComponent },
  { path: 'ejemplares/Viking-II-Iz-Omskoi-Kreposti', component: VikingComponent },
  { path: 'ejemplares/Veni-Vidi-Vici', component: ViniComponent },
  { path: 'ejemplares/Forrest-Fortuna-Aiuvat-de-Brisas-Del-Arrayan', component: FortunaComponent },
  { path: 'ejemplares/Carmela-de-Brisas-Del-Arrayan', component: CarmelaComponent },
  { path: 'cachorros', component: CachorrosComponent, children: [
    { path: ':nombre', component: CachorrosComponent }
  ]},
  { path: 'camadas', component: CamadasComponent },
  { path: 'novedades', component: NovedadesComponent },
  { path: '', redirectTo: '/novedades', pathMatch: 'full' }
];