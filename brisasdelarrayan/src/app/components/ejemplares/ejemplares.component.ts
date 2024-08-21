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
  selectedEjemplar: any;

  constructor(
    private ejemplaresService: EjemplaresService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.ejemplaresService.getEjemplares().subscribe(data => {
      this.ejemplares = data;

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

  goToEjemplar(nombre: string) {
    const sanitizedNombre = this.sanitizeName(nombre);
    this.router.navigate(['/ejemplares', sanitizedNombre]);
  }
  
  sanitizeName(nombre: string): string {
    return nombre.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
  }
}