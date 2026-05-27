import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EjemplaresService } from '../../core/services/ejemplares.service';

/*import { EjemplarGridComponent } from '../../components/ejemplar-grid/ejemplar-grid.component';*/

@Component({
  selector: 'app-ejemplares-page',
  standalone: true,
  imports: [
    CommonModule,
    /*EjemplarGridComponent*/
  ],
  templateUrl: './ejemplares-page.component.html'
})
export class EjemplaresPageComponent {

  private ejemplaresService = inject(EjemplaresService);

  ejemplares$ = this.ejemplaresService.getEjemplares();

}
