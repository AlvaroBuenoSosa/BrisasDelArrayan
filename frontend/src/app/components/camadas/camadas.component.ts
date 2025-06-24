import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CamadasService } from '../../services/camadas.service';
import { EjemplaresService } from '../../services/ejemplares.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-camadas',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para las directivas ngIf/ngFor
  templateUrl: './camadas.component.html',
  styleUrls: ['./camadas.component.scss']
})
export class CamadasComponent implements OnInit {
  camadas: any[] = [];
  ejemplares: any[] = [];

  constructor(
    private camadasService: CamadasService, 
    private ejemplaresService: EjemplaresService,
    private router: Router // Inyecta el Router
  ) { }

  ngOnInit(): void {
    forkJoin({
      camadas: this.camadasService.getCamadas(),
      ejemplares: this.ejemplaresService.getEjemplares()
    }).subscribe(({ camadas, ejemplares }) => {
      this.camadas = camadas;
      this.ejemplares = ejemplares;

      this.camadas.forEach(camada => {
        const padre = this.ejemplares.find(ejemplar => ejemplar.id === camada.padreId);
        const madre = this.ejemplares.find(ejemplar => ejemplar.id === camada.madreId);

        camada.padreNombre = padre ? padre.name : 'Desconocido';
        camada.madreNombre = madre ? madre.name : 'Desconocido';

        if (!padre) {
          console.error(`Padre no encontrado para camada ID ${camada.id} con padreId ${camada.padreId}`);
        }
        if (!madre) {
          console.error(`Madre no encontrada para camada ID ${camada.id} con madreId ${camada.madreId}`);
        }
      });
    });
  }

filtrarCachorros(camadaId: number): void {
  this.router.navigate(['/cachorros-por-camada'], {
    queryParams: { camadaId }
  });
}
}
