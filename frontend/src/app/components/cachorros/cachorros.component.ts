import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CachorrosService } from '../../services/cachorros.service';
import { EjemplaresService } from '../../services/ejemplares.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface Cachorro {
  id: number;
  nombre: string;
  raza: string;
  photo: string;
  color: string;
  sexo: 'Macho' | 'Hembra';
  fechaNacimiento: string; // Podrías usar Date si conviertes los strings
  padreId: number;
  madreId: number;
  camadaId: number;
  padreNombre?: string;
  madreNombre?: string;
}

@Component({
  selector: 'app-cachorros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cachorros.component.html',
  styleUrl: './cachorros.component.scss'
})
export class CachorrosComponent implements OnInit {

  cachorros: Cachorro[] = [];
  ejemplares: any[] = [];
  ejemplaresPedigree: any[] = [];
  selectedCachorro: Cachorro | null = null;

  constructor(
    private cachorrosService: CachorrosService,
    private ejemplaresService: EjemplaresService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Cargar cachorros
    this.cachorrosService.getCachorros().subscribe(cachorrosData => {
      this.cachorros = cachorrosData;

      // Cargar ejemplares normales
      this.ejemplaresService.getEjemplares().subscribe(ejemplaresData => {

        // Cargar ejemplares del pedigree
        this.ejemplaresService.getEjemplaresPedigree().subscribe(pedigreeData => {
          this.ejemplares = ejemplaresData;
          this.ejemplaresPedigree = pedigreeData;

          // Asociar padre/madre a cada cachorro
          this.cachorros = this.cachorros.map(cachorro => this.completarPadreYMadre(cachorro));

          // Escuchar cambios de ruta
          this.route.paramMap.subscribe(params => {
            const nombreFormateado = params.get('nombre');
            if (nombreFormateado) {
              this.selectedCachorro = this.cachorros.find(e =>
  this.formatNombreParaUrl(e.nombre) === nombreFormateado
) ?? null;
            }
          });
        });
      });
    });
  }

  completarPadreYMadre(cachorro: any): any {
    const padre = this.ejemplares.find(e => e.id === cachorro.padreId)
               || this.ejemplaresPedigree.find(e => e.id === cachorro.padreId);

    const madre = this.ejemplares.find(e => e.id === cachorro.madreId)
               || this.ejemplaresPedigree.find(e => e.id === cachorro.madreId);

    cachorro.padreNombre = padre ? padre.name : 'Desconocido';
    cachorro.madreNombre = madre ? madre.name : 'Desconocido';

    return cachorro;
  }

  goToCachorro(nombre: string): void {
    const nombreFormateado = this.formatNombreParaUrl(nombre);
    this.router.navigate(['/cachorros', nombreFormateado]);
  }

  formatNombreParaUrl(nombre: string): string {
    return nombre
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');
  }
}

