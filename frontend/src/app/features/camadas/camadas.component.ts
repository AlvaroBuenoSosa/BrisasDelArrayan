import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { normalizeImageUrl } from '../../shared/utils/image-url.util';
import { CamadasService } from '../../core/services/camadas/camadas.service';
import { EjemplaresService } from '../../core/services/ejemplares/ejemplares.service';

@Component({
  selector: 'app-camadas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camadas.component.html',
  styleUrls: ['./camadas.component.scss']
})
export class CamadasComponent implements OnInit {

  camadas: any[] = [];

  perros: any[] = [];

  constructor(
    private camadasService: CamadasService,
    private ejemplaresService: EjemplaresService,
    private router: Router
  ) {}

  ngOnInit(): void {

    forkJoin({

      camadas:
        this.camadasService.getCamadas(),

      ejemplares:
        this.ejemplaresService.getEjemplares(),

      ejemplaresPedigree:
        this.ejemplaresService.getEjemplaresPedigree()

    }).subscribe({

      next: ({
        camadas,
        ejemplares,
        ejemplaresPedigree
      }) => {

        this.camadas = camadas;

        this.perros = [
          ...ejemplares,
          ...ejemplaresPedigree
        ];

        this.camadas.forEach(camada => {

          camada.imagenPadre = normalizeImageUrl(camada.imagenPadre);
          camada.imagenMadre = normalizeImageUrl(camada.imagenMadre);

          const padre = this.perros.find(
            perro => perro.id === camada.padreId
          );

          const madre = this.perros.find(
            perro => perro.id === camada.madreId
          );

          camada.padreNombre =
            padre?.name ||
            padre?.nombre ||
            'Desconocido';

          camada.madreNombre =
            madre?.name ||
            madre?.nombre ||
            'Desconocido';
        });
      },

      error: error => {

        console.error(
          'Error cargando camadas',
          error
        );
      }
    });
  }

  filtrarCachorros(
    camadaId: number
  ): void {

    this.router.navigate(
      ['/cachorros-por-camada'],
      {
        queryParams: {
          camadaId
        }
      }
    );
  }
}
