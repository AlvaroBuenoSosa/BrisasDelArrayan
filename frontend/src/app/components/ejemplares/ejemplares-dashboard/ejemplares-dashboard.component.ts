import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EjemplaresService } from '../../../services/ejemplares.service';
import { CommonModule } from '@angular/common';
import { PedigreeComponent } from '../../pedigree/pedigree.component';

@Component({
  selector: 'app-ejemplares-dashboard',
  standalone: true,
  imports: [CommonModule, PedigreeComponent],
  templateUrl: './ejemplares-dashboard.component.html',
  styleUrls: ['./ejemplares-dashboard.component.scss']
})
export class EjemplaresDashboardComponent implements OnInit {
  ejemplares: any[] = []; // Lista de ejemplares
  selectedEjemplar: any | null = null; // Ejemplar seleccionado
  pedigreeFiltrado: any[] = []; // Datos filtrados del pedigree

  constructor(
    private route: ActivatedRoute,
    private ejemplaresService: EjemplaresService
  ) {}

  ngOnInit(): void {
    this.loadEjemplares();
  }

  // Cargar todos los ejemplares y seleccionar uno si está en la URL
private loadEjemplares(): void {
  this.ejemplaresService.getEjemplares().subscribe(
    data => {
      // Convertimos 'photo' en array si es una string
      this.ejemplares = data.map(e => ({
        ...e,
        photo: typeof e.photo === 'string' ? e.photo.split(',') : e.photo
      }));

      this.handleRouteParams();
    },
    error => {
      console.error('Error al cargar ejemplares:', error);
    }
  );
}


  // Manejar parámetros de la URL para seleccionar un ejemplar
private handleRouteParams(): void {
  this.route.paramMap.subscribe(params => {
    const nameFormateado = params.get('name');
    if (nameFormateado) {
      this.selectedEjemplar = this.ejemplares.find(e =>
        this.formatNombreParaUrl(e.name) === nameFormateado
      );

      if (this.selectedEjemplar) {
        // Asegurarse de que tenga un array de fotos
        if (!this.selectedEjemplar.photos || !Array.isArray(this.selectedEjemplar.photos)) {
          const singlePhoto = this.selectedEjemplar.photo || '';
          this.selectedEjemplar.photos = singlePhoto ? [singlePhoto] : [];
        }

        this.loadEjemplaresPedigree(this.selectedEjemplar.id);
        console.log('Selected Ejemplar:', this.selectedEjemplar);
      } else {
        console.warn('Ejemplar no encontrado en la lista.');
        this.pedigreeFiltrado = [];
      }
    }
  });
}


  // Cargar los datos del pedigree del ejemplar seleccionado
  private loadEjemplaresPedigree(idEjemplarSeleccionado: number): void {
    console.log('Cargando pedigree para ID:', idEjemplarSeleccionado);
    this.ejemplaresService.getEjemplaresPedigreeById(idEjemplarSeleccionado).subscribe(
      pedigreeData => {
        console.log('Datos obtenidos del pedigree:', pedigreeData);
        this.pedigreeFiltrado = pedigreeData?.pedigree || [];
      },
      error => {
        console.error('Error al obtener datos del pedigree:', error);
        this.pedigreeFiltrado = [];
      }
    );
  }
  

  // Formatear el nombre del ejemplar para coincidir con la URL
  private formatNombreParaUrl(name: string | undefined | null): string {
    if (!name) {
      console.warn('El name es indefinido o nulo');
      return '';
    }
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  }
}

