import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { map, switchMap, of } from 'rxjs';

import { CachorrosService } from '../../../../core/services/cachorros/cachorros.service';
import { CamadasService } from '../../../../core/services/camadas/camadas.service';

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

  private camadasService = inject(CamadasService);

  cachorros$ = this.route.paramMap.pipe(

    map(params => Number(params.get('id'))),

    switchMap(camadaId =>

      this.camadasService.getCamadas().pipe(

switchMap(camadas => {

  const camada = camadas.find(
    c => c.id === camadaId
  );

  if (!camada) {
    return of([]);
  }

  return this.cachorrosService.getCachorros().pipe(

            map(cachorros =>
              cachorros.filter(
                cachorro =>
                  cachorro.padreId === camada.padreId &&
                  cachorro.madreId === camada.madreId
              )
            )

          );
        })

      )

    )

  );

}