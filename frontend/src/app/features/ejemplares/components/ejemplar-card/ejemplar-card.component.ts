import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Ejemplar } from '../../interfaces/ejemplar.interface';

@Component({
  selector: 'app-ejemplar-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ejemplar-card.component.html',
  styleUrls: ['./ejemplar-card.component.scss']
})
export class EjemplarCardComponent {

  @Input({ required: true })
  ejemplar!: Ejemplar;

  constructor(
    private router: Router
  ) {}

  goToDetail(): void {

    const slug = this.slugify(this.ejemplar.name);

    this.router.navigate([
      '/ejemplares',
      slug
    ]);
  }

  getPhoto(): string {
  if (Array.isArray(this.ejemplar.photo)) {
    return this.ejemplar.photo[0];
  }

  return this.ejemplar.photo;
}

  private slugify(value: string): string {

    return value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}