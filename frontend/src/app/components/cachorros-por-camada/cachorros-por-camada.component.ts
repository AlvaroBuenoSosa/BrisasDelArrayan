import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CachorrosService } from '../../services/cachorros.service';

@Component({
  selector: 'app-cachorros-por-camada',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Cachorros de la camada</h2>
    <div *ngIf="cachorros.length === 0">
      No se encontraron cachorros para esta camada.
    </div>
    <div *ngIf="cachorros.length > 0" class="cachorros-list">
      <div *ngFor="let cachorro of cachorros" class="cachorro-card" (click)="verDetalle(cachorro.id)">
        <img [src]="getPhoto(cachorro)" [alt]="cachorro.nombre" />
        <h3>{{ cachorro.nombre }}</h3>
        <p>Raza: {{ cachorro.raza }}</p>
        <p>Sexo: {{ cachorro.sexo }}</p>
        <p>Color: {{ cachorro.color }}</p>
      </div>
    </div>
  `,
  styles: [`
    .cachorros-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .cachorro-card {
      cursor: pointer;
      border: 1px solid #ccc;
      padding: 8px;
      width: 200px;
      text-align: center;
      border-radius: 4px;
      transition: box-shadow 0.3s;
    }
    .cachorro-card:hover {
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    }
    .cachorro-card img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }
  `]
})
export class CachorrosPorCamadaComponent implements OnInit {
  cachorros: any[] = [];
  camadaId!: number;

  constructor(
    private route: ActivatedRoute,
    private cachorrosService: CachorrosService,
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    this.camadaId = +params['camadaId'];
    this.loadCachorros();
  });
}

loadCachorros(): void {
  this.cachorrosService.getCachorros().subscribe(data => {
    this.cachorros = data.filter(c => c.camadaId === this.camadaId);
  });
}

  getPhoto(cachorro: any): string {
    if (Array.isArray(cachorro.photos) && cachorro.photos.length > 0) {
      return cachorro.photos[0];
    }
    return cachorro.photo || 'assets/default-dog.jpg';
  }

  verDetalle(id: number): void {
    // Navegar a detalle si quieres
  }
}



