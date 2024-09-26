import { CachorrosComponent } from './components/cachorros/cachorros.component';
import { EjemplaresComponent } from './components/ejemplares/ejemplares.component';
import { CamadasComponent } from './components/camadas/camadas.component';
import { Routes } from '@angular/router';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { Cachorro1Component } from './components/cachorros/cachorro1/cachorro1.component';
import { Cachorro2Component } from './components/cachorros/cachorro2/cachorro2.component';
import { Cachorro3Component } from './components/cachorros/cachorro3/cachorro3.component';
import { Cachorro4Component } from './components/cachorros/cachorro4/cachorro4.component';
import { Cachorro5Component } from './components/cachorros/cachorro5/cachorro5.component';
import { EjemplaresDashboardComponent } from './components/ejemplares/ejemplares-dashboard/ejemplares-dashboard.component';


export const routes: Routes = [
  { path: 'ejemplares', component: EjemplaresComponent },
  { path: 'ejemplares/:nombre', component: EjemplaresDashboardComponent }, // Ruta con parámetro 'nombre'
  { path: '', redirectTo: '/ejemplares', pathMatch: 'full' },
  { path: 'cachorros', component: CachorrosComponent},
  { path: 'cachorros/Bruno', component: Cachorro1Component},
  { path: 'cachorros/Daisy', component: Cachorro2Component},
  { path: 'cachorros/Rocky', component: Cachorro3Component},
  { path: 'cachorros/Molly', component: Cachorro4Component},
  { path: 'cachorros/Charlie', component: Cachorro5Component},
  { path: 'camadas', component: CamadasComponent },
  { path: 'detalle-cachorro/:id', component: CachorrosComponent },
  { path: 'novedades', component: NovedadesComponent },
  { path: '', redirectTo: '/novedades', pathMatch: 'full' }
];