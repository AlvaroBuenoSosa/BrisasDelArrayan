import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { forkJoin, map } from 'rxjs';

import { CachorrosService } from '../../../../core/services/cachorros/cachorros.service';
import { EjemplaresService } from '../../../../core/services/ejemplares/ejemplares.service';

import { CachorroCardComponent } from '../../components/cachorro-card/cachorro-card.component';

@Component({
  selector: 'app-cachorros-page',
  standalone: true,
  imports: [
    CommonModule,
    CachorroCardComponent
  ],
  templateUrl: './cachorros-page.component.html',
  styleUrls: ['./cachorros-page.component.scss']
})
export class CachorrosPageComponent {

  private cachorrosService = inject(CachorrosService);

  private ejemplaresService = inject(EjemplaresService);

  cachorros$ = forkJoin({

    cachorros:
      this.cachorrosService.getCachorros(),

    ejemplares:
      this.ejemplaresService.getEjemplares(),

    pedigree:
      this.ejemplaresService.getEjemplaresPedigree()

  }).pipe(

    map(({ cachorros, ejemplares, pedigree }) => {

      const perros = [
        ...ejemplares,
        ...pedigree
      ];

      return cachorros.map(cachorro => {

        const padre = perros.find(
          p => p.id === cachorro.padreId
        );

        const madre = perros.find(
          p => p.id === cachorro.madreId
        );

        return {
          ...cachorro,

          padreNombre:
            padre?.name || padre?.nombre || 'Desconocido',

          madreNombre:
            madre?.name || madre?.nombre || 'Desconocida'
        };

      });

    })

  );

}