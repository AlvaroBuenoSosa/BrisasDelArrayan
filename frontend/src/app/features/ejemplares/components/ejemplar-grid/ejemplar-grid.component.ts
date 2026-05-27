import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ejemplar } from '../../interfaces/ejemplar.interface';

import { EjemplarCardComponent } from '../ejemplar-card/ejemplar-card.component';

@Component({
  selector: 'app-ejemplar-grid',
  standalone: true,
  imports: [
    CommonModule,
    EjemplarCardComponent
  ],
  templateUrl: './ejemplar-grid.component.html',
  styleUrls: ['./ejemplar-grid.component.scss']
})
export class EjemplarGridComponent {

  @Input() ejemplares: Ejemplar[] | null = [];

}