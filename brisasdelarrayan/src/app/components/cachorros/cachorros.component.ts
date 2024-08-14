import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CachorrosService } from '../../shared/services/cachorros.service';
import { EjemplaresService } from '../../shared/services/ejemplares.service';

@Component({
  selector: 'app-cachorros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cachorros.component.html',
  styleUrl: './cachorros.component.scss'
})
export class CachorrosComponent {
  cachorros: any[] = [];
  ejemplares: any[] = [];

  constructor(
    private cachorrosService: CachorrosService,
    private ejemplaresService: EjemplaresService
  ) {}

  ngOnInit(): void {
    this.cachorrosService.getCachorros().subscribe(cachorrosData => {
      this.cachorros = cachorrosData;

      this.ejemplaresService.getEjemplares().subscribe(ejemplaresData => {
        this.ejemplares = ejemplaresData;

        this.cachorros.forEach(cachorro => {
          const padre = this.ejemplares.find(ejemplar => ejemplar.id === cachorro.padreId);
          const madre = this.ejemplares.find(ejemplar => ejemplar.id === cachorro.madreId);
          cachorro.padreNombre = padre ? padre.nombre : 'Desconocido';
          cachorro.madreNombre = madre ? madre.nombre : 'Desconocido';
        });
      });
    });
  }
}