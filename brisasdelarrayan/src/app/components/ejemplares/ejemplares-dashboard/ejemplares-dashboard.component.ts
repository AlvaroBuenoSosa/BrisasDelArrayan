import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EjemplaresService } from '../../../shared/services/ejemplares.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ejemplares-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ejemplares-dashboard.component.html',
  styleUrls: ['./ejemplares-dashboard.component.scss']
})
export class EjemplaresDashboardComponent implements OnInit {
  ejemplares: any[] = []; // Todos los ejemplares
  selectedEjemplar: any = null; // Ejemplar seleccionado por el nombre en la URL
  ejemplaresPedigree: any[] = []; // Ejemplares cuyo fk_idejemplar coincide con el id del ejemplar seleccionado

  constructor(
    private route: ActivatedRoute,
    private ejemplaresService: EjemplaresService
  ) { }

  ngOnInit(): void {
    // Cargar todos los ejemplares desde el servicio
    this.loadEjemplares();
  }

  // Método para cargar todos los ejemplares
  loadEjemplares(): void {
    this.ejemplaresService.getEjemplares().subscribe(data => {
      this.ejemplares = data;

      // Suscripción al cambio de parámetros en la ruta
      this.route.paramMap.subscribe(params => {
        const nombreFormateado = params.get('nombre');
        if (nombreFormateado) {
          // Buscar el ejemplar por el nombre formateado
          this.selectedEjemplar = this.ejemplares.find(e =>
            this.formatNombreParaUrl(e.nombre) === nombreFormateado
          );

          // Si se encuentra el ejemplar, cargar los ejemplares con pedigree
          if (this.selectedEjemplar) {
            this.loadEjemplaresPedigree(this.selectedEjemplar.id);
          }
        }
      });
    });
  }

  // Método para cargar los ejemplares cuyo fk_idejemplar coincide con el id del ejemplar seleccionado
  loadEjemplaresPedigree(idEjemplarSeleccionado: number): void {
    this.ejemplaresService.getEjemplaresPedigree().subscribe(data => {
      // Filtrar todos los ejemplares cuyo fk_idejemplar coincide con el id del ejemplar seleccionado
      this.ejemplaresPedigree = data.filter(e => e.fk_idejemplar === idEjemplarSeleccionado);
    });
  }

  // Método para formatear el nombre del ejemplar de manera similar al de la URL
  formatNombreParaUrl(nombre: string): string {
    return nombre
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');
  }

  // Método para verificar si un ejemplar debe ser resaltado según madreId o padreId
  esSeleccionado(ejemplar: any): boolean {
    // Busca si el ejemplar tiene un padre o madre cuyo id coincida con otro ejemplar
    const madreCoincide = this.ejemplares.some(e => e.id === ejemplar.madreId);
    const padreCoincide = this.ejemplares.some(e => e.id === ejemplar.padreId);
    
    return madreCoincide || padreCoincide;
  }
}

