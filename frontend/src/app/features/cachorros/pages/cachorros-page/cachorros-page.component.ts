import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CachorrosService } from '../../../../core/services/cachorros/cachorros.service';

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

  cachorros$ = this.cachorrosService.getCachorros();

}