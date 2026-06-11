import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { forkJoin, map, switchMap } from 'rxjs';

import { CachorrosService } from '../../../../core/services/cachorros/cachorros.service';
import { EjemplaresService } from '../../../../core/services/ejemplares/ejemplares.service';

import { CachorroCardComponent } from '../../components/cachorro-card/cachorro-card.component';

@Component({
  selector: 'app-cachorros-por-camada-page',
  standalone: true,
  imports: [
    CommonModule,
    CachorroCardComponent
  ],
  templateUrl: './cachorros-por-camada-page.component.html',
  styleUrls: ['./cachorros-por-camada-page.component.scss']
})
export class CachorrosPorCamadaPageComponent {

  private route = inject(ActivatedRoute);

  private cachorrosService = inject(CachorrosService);

  private ejemplaresService = inject(EjemplaresService);

  cachorros$ = this.route.paramMap.pipe(

    map(params => Number(params.get('id'))),

    switchMap(camadaId =>

      forkJoin({

        cachorros:
          this.cachorrosService.getCachorrosPorCamada(camadaId),

        ejemplares:
          this.ejemplaresService.getEjemplares(),

        pedigree:
          this.ejemplaresService.getEjemplaresPedigree()

      })

    ),

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
            padre?.name ||
            padre?.nombre ||
            'Desconocido',

          madreNombre:
            madre?.name ||
            madre?.nombre ||
            'Desconocida'
        };

      });

    })

  );
}