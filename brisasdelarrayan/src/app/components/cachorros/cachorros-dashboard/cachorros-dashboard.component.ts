import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CachorrosComponent } from '../cachorros.component';
import { CachorrosService } from '../../../shared/services/cachorros.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cachorros-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cachorros-dashboard.component.html',
  styleUrl: './cachorros-dashboard.component.scss'
})
export class CachorrosDashboardComponent implements OnInit{

  cachorros: any[] = [];
  selectedCachorro: any = null;

  constructor(
    private route: ActivatedRoute,
    private cachorrosService: CachorrosService
  ) { }

  ngOnInit(): void {
  // Cargar todos los ejemplares desde el servicio
  this.cachorrosService.getCachorros().subscribe(data => {
    this.cachorros = data;

    // Suscripción al cambio de parámetros en la ruta
    this.route.paramMap.subscribe(params => {
      const nombreFormateado = params.get('nombre');
      if (nombreFormateado) {
        // Buscar el ejemplar por el nombre formateado
        this.selectedCachorro = this.cachorros.find(e => 
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
