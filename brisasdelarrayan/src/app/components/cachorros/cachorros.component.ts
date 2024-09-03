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
  ejemplares: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private cachorrosService: CachorrosService,
    private ejemplaresService: EjemplaresService,
    private camadasService: CamadasService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
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
    if (id) {
      this.camadasService.getCachorroById(id).subscribe(cachorro => {
        this.cachorros = cachorro;
      }, error => {
        console.error('Error fetching cachorro details:', error);
      });
    } else {
      console.error('Cachorro ID is null');
    }  
    
  }

  goToCachorro(nombre: string) {
    const sanitizedNombre = this.sanitizeName(nombre);
    this.router.navigate(['/cachorros', sanitizedNombre]);
  }
  
  sanitizeName(nombre: string): string {
    return nombre.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
  }

}