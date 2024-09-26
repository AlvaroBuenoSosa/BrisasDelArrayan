import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EjemplaresService } from '../../../shared/services/ejemplares.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ejemplares-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ejemplares-dashboard.component.html',
  styleUrl: './ejemplares-dashboard.component.scss'
})
export class EjemplaresDashboardComponent implements OnInit {
  ejemplares: any[] = [];
  selectedEjemplar: any = null;

  constructor(
    private route: ActivatedRoute,
    private ejemplaresService: EjemplaresService
  ) { }

  ngOnInit(): void {
    // Cargar todos los ejemplares desde el servicio
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
        }
      });
    });
  }
  
  // Método para formatear el nombre del ejemplar de manera similar
  formatNombreParaUrl(nombre: string): string {
    return nombre
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');
  }
}