import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { CamadasService } from '../../../../core/services/camadas/camadas.service';

import { EjemplaresService } from '../../../../core/services/ejemplares/ejemplares.service';

import { Camada } from '../../interfaces/camada.interface';

import { CamadaCardComponent } from '../../components/camada-card/camada-card.component';

@Component({
  selector: 'app-camadas-page',
  standalone: true,
  imports: [
    CommonModule,
    CamadaCardComponent
  ],
  templateUrl: './camada-page.component.html',
  styleUrls: ['./camada-page.component.scss']
})
export class CamadasPageComponent implements OnInit {

  camadas: Camada[] = [];

  loading = true;

  constructor(
    private camadasService: CamadasService,
    private ejemplaresService: EjemplaresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCamadas();
  }

  private loadCamadas(): void {

    forkJoin({
      camadas:
        this.camadasService.getCamadas(),

      ejemplares:
        this.ejemplaresService.getEjemplares()
    })
    .subscribe({

      next: ({ camadas, ejemplares }) => {

        this.camadas = camadas.map(
          camada => {

            const padre =
              ejemplares.find(
                e => e.id === camada.padreId
              );

            const madre =
              ejemplares.find(
                e => e.id === camada.madreId
              );

            return {
              ...camada,

              padreNombre:
                padre?.name || 'Desconocido',

              madreNombre:
                madre?.name || 'Desconocida'
            };
          }
        );

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Error cargando camadas',
          error
        );

        this.loading = false;
      }
    });
  }

openCamada(camadaId: number): void {

  this.router.navigate([
    '/cachorros-por-camada',
    camadaId
  ]);
}
}