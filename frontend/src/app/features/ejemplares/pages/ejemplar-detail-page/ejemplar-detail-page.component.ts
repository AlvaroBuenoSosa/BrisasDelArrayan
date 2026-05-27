import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { switchMap, map } from 'rxjs';

import { EjemplaresService } from '../../../../core/services/ejemplares/ejemplares.service';

import { PedigreeComponent } from '../../../../shared/components/pedigree/pedigree.component';

import { EjemplarCarouselComponent } from '../../components/ejemplar-carousel/ejemplar-carousel.component';

@Component({
  selector: 'app-ejemplar-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    PedigreeComponent,
    EjemplarCarouselComponent
  ],
  templateUrl: './ejemplar-detail-page.component.html',
  styleUrls: ['./ejemplar-detail-page.component.scss']
})
export class EjemplarDetailPageComponent {

  private route = inject(ActivatedRoute);

  private ejemplaresService = inject(EjemplaresService);

  ejemplar$ = this.route.paramMap.pipe(

    switchMap(params => {

      const slug = params.get('slug') || '';

      return this.ejemplaresService
        .getEjemplares()
        .pipe(
          map(items =>
            items.find(
              e => this.slugify(e.name) === slug
            )
          )
        );
    })
  );

  private slugify(value: string): string {

    return value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}