import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CachorrosService } from '../../shared/services/cachorros.service';
import { EjemplaresService } from '../../shared/services/ejemplares.service';
import { CamadasService } from '../../shared/services/camadas.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cachorros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cachorros.component.html',
  styleUrl: './cachorros.component.scss'
})
export class CachorrosComponent implements OnInit{

  cachorros: any[] = [];
  ejemplares: any[] = []; // Lista de ejemplares (padres y madres)
  selectedCachorro: any = null;

  constructor(
    private cachorrosService: CachorrosService,
    private ejemplaresService: EjemplaresService, // Servicio para ejemplares
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Cargar los cachorros
    this.cachorrosService.getCachorros().subscribe(cachorrosData => {
      this.cachorros = cachorrosData;

      // Cargar los ejemplares (padres y madres)
      this.ejemplaresService.getEjemplares().subscribe(ejemplaresData => {
        this.ejemplares = ejemplaresData;

        // Asociar padres y madres a los cachorros
        this.cachorros = this.cachorros.map(cachorro => this.completarPadreYMadre(cachorro));

        // Suscripción al cambio de parámetros en la ruta
        this.route.paramMap.subscribe(params => {
          const nombreFormateado = params.get('nombre');
          if (nombreFormateado) {
            // Buscar el cachorro por el nombre formateado
            this.selectedCachorro = this.cachorros.find(e => 
              this.formatNombreParaUrl(e.nombre) === nombreFormateado
            );
          }
        });
      });
    });
  }

  completarPadreYMadre(cachorro: any): any {
    // Buscar el nombre del padre
    const padre = this.ejemplares.find(e => e.id === cachorro.padreId);
    const madre = this.ejemplares.find(e => e.id === cachorro.madreId);

    // Asignar los nombres si se encuentran
    cachorro.padreNombre = padre ? padre.nombre : 'Desconocido';
    cachorro.madreNombre = madre ? madre.nombre : 'Desconocido';

    return cachorro;
  }

  goToCachorro(nombre: string): void {
    const nombreFormateado = this.formatNombreParaUrl(nombre);
    this.router.navigate(['/cachorros', nombreFormateado]);
  }

  formatNombreParaUrl(nombre: string): string {
    return nombre
      .toLowerCase()            // Convertir a minúsculas
      .replace(/\s+/g, '-')      // Reemplazar espacios por guiones
      .replace(/[^a-z0-9\-]/g, ''); // Eliminar caracteres especiales
  }
}