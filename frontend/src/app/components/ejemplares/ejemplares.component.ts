import { Component, OnInit } from '@angular/core';
import { EjemplaresService } from '../../services/ejemplares.service'; // Asegúrate de que el servicio esté importado
import { CommonModule } from '@angular/common'; // Necesario para usar *ngIf y *ngFor
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ejemplares',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para las directivas ngIf/ngFor
  templateUrl: './ejemplares.component.html',
  styleUrls: ['./ejemplares.component.scss'],
})
export class EjemplaresComponent implements OnInit {
  ejemplares: any[] = [];
  selectedEjemplar: any = null;

  constructor(
    private ejemplaresService: EjemplaresService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Cargar todos los ejemplares desde el servicio
    this.ejemplaresService.getEjemplares().subscribe(data => {
      this.ejemplares = data; // Aquí 'data' es el array de ejemplares

      // Suscripción al cambio de parámetros en la ruta
      this.route.paramMap.subscribe(params => {
        const name = params.get('name');
        if (name) {
          // Buscar el ejemplar por el 'name' formateado
          this.selectedEjemplar = this.ejemplares.find(e => this.formatNombreParaUrl(e.name) === name);
        } else {
          this.selectedEjemplar = null;
        }
      });
    });
  }

  formatNombreParaUrl(name: string): string {
    return name
      .toLowerCase()            // Convertir a minúsculas
      .replace(/\s+/g, '-')      // Reemplazar espacios por guiones
      .replace(/[^a-z0-9\-]/g, ''); // Eliminar caracteres especiales
  }

  // Método para navegar al ejemplar seleccionado
  verEjemplar(name: string): void {
    const nombreFormateado = this.formatNombreParaUrl(name);
    this.router.navigate(['/ejemplares', nombreFormateado]);
    console.log('click');
  }
}

