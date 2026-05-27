import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Cachorro } from '../../interfaces/cachorro.interface';

@Component({
  selector: 'app-cachorro-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './cachorro-card.component.html',
  styleUrls: ['./cachorro-card.component.scss']
})
export class CachorroCardComponent {

  @Input({ required: true })
  cachorro!: Cachorro;

  formatNombre(nombre: string): string {

    return nombre
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  }

}