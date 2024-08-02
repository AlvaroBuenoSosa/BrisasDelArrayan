import { CachorrosComponent } from './components/cachorros/cachorros.component';
import { EjemplaresComponent } from './components/ejemplares/ejemplares.component';
import { CamadasComponent } from './components/camadas/camadas.component';
import { Routes } from '@angular/router';
import { NovedadesComponent } from './components/novedades/novedades.component';


export const routes: Routes = [
    { path: 'ejemplares', component: EjemplaresComponent },
    { 
      path: 'cachorros', 
      component: CachorrosComponent,
      children: [
        { path: ':nombre', component: CachorrosComponent }
      ]
    },
    { path: 'camadas', component: CamadasComponent },
    { path: 'novedades', component: NovedadesComponent },
  ];