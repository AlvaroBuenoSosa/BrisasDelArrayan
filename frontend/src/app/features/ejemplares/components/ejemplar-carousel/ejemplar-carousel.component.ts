import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ejemplar-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ejemplar-carousel.component.html',
  styleUrls: ['./ejemplar-carousel.component.scss']
})
export class EjemplarCarouselComponent {

  @Input()
  photos: string[] = [];

}