import { Component, OnInit } from '@angular/core';
import { CamadasService } from '../../shared/services/camadas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EjemplaresService } from '../../shared/services/ejemplares.service';

@Component({
  selector: 'app-camadas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './camadas.component.html',
  styleUrl: './camadas.component.scss'
})
export class CamadasComponent implements OnInit{
  camadas: any[] = [];
  ejemplares: any[] = [];

  constructor(private camadasService: CamadasService, private ejemplaresService: EjemplaresService) { }

  ngOnInit(): void {
    this.camadasService.getCamadas().subscribe(camadasData => {
      this.camadas = camadasData;

      this.ejemplaresService.getEjemplares().subscribe(ejemplaresData => {
        this.ejemplares = ejemplaresData;

        this.camadas.forEach(camadas => {
          const padre = this.ejemplares.find(ejemplar => ejemplar.id === camadas.padreId);
          const madre = this.ejemplares.find(ejemplar => ejemplar.id === camadas.madreId);
          camadas.padreNombre = padre ? padre.nombre : 'Desconocido';
          camadas.madreNombre = madre ? madre.nombre : 'Desconocido';
        });
      });
    });
  }
}
