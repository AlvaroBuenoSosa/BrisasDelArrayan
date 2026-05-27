import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { map, switchMap } from 'rxjs';

import { CachorrosService } from '../../../../core/services/cachorros/cachorros.service';

import { CachorroDetailComponent } from '../../components/cachorro-detail/cachorro-detail.component';

@Component({
  selector: 'app-cachorro-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    CachorroDetailComponent
  ],
  templateUrl: './cachorro-detail-page.component.html',
  styleUrls: ['./cachorro-detail-page.component.scss']
})
export class CachorroDetailPageComponent {

  private route = inject(ActivatedRoute);

  private cachorrosService = inject(CachorrosService);

  cachorro$ = this.route.paramMap.pipe(

    map(params => params.get('slug')),

    switchMap(slug =>
      this.cachorrosService.getCachorroBySlug(slug || '')
    )

  );

}