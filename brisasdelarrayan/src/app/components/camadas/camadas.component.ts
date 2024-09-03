import { Component, OnInit } from '@angular/core';
import { CamadasService } from '../../shared/services/camadas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EjemplaresService } from '../../shared/services/ejemplares.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camadas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './camadas.component.html',
  styleUrl: './camadas.component.scss'
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
  
        camada.padreNombre = padre ? padre.nombre : 'Desconocido';
        camada.madreNombre = madre ? madre.nombre : 'Desconocido';
  
        if (!padre) {
          console.error(`Padre no encontrado para camada ID ${camada.id} con padreId ${camada.padreId}`);
        }
        if (!madre) {
          console.error(`Madre no encontrada para camada ID ${camada.id} con madreId ${camada.madreId}`);
        }
      });
    });
  }

  navigateToCachorro(id: number): void {
    this.router.navigate(['/detalle-cachorro', id]); // Navega al componente de detalles del cachorro
  }
}