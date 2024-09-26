import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EjemplaresService } from '../../shared/services/ejemplares.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ejemplares',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ejemplares.component.html',
  styleUrls: ['./ejemplares.component.scss'] // Cambié styleUrl por styleUrls para corregir el error de nombre de propiedad
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
        const nombre = params.get('nombre');
        if (nombre) {
          this.selectedEjemplar = this.ejemplares.find(e => e.nombre === nombre);
        } else {
          this.selectedEjemplar = null;
        }
      });
    });
  }

  formatNombreParaUrl(nombre: string): string {
    return nombre
      .toLowerCase()            // Convertir a minúsculas
      .replace(/\s+/g, '-')      // Reemplazar espacios por guiones
      .replace(/[^a-z0-9\-]/g, ''); // Eliminar caracteres especiales
  }
  
  // Método para navegar al ejemplar seleccionado
  verEjemplar(nombre: string): void {
    const nombreFormateado = this.formatNombreParaUrl(nombre);
    this.router.navigate(['/ejemplares', nombreFormateado]);
  }
}