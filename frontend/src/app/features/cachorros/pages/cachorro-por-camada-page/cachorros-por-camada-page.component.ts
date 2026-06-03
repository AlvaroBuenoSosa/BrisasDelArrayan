import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { map, switchMap } from 'rxjs';

import { CachorrosService } from '../../../../core/services/cachorros/cachorros.service';

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

  cachorros$ = this.route.paramMap.pipe(

    map(params => Number(params.get('id'))),

    switchMap(id =>
      this.cachorrosService.getCachorrosPorCamada(id)
    )

  );

}