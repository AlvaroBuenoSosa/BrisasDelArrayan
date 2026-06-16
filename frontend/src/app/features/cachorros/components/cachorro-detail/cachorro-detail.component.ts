import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { normalizeImageUrl } from '../../../../shared/utils/image-url.util';
import { Cachorro } from '../../interfaces/cachorro.interface';

import { PedigreeComponent } from '../../../../shared/components/pedigree/pedigree.component';

@Component({
  selector: 'app-cachorro-detail',
  standalone: true,
  imports: [
    CommonModule,
    PedigreeComponent
  ],
  templateUrl: './cachorro-detail.component.html',
  styleUrls: ['./cachorro-detail.component.scss']
})
export class CachorroDetailComponent {

  @Input({ required: true })
  cachorro!: Cachorro;

  getPhotos(): string[] {

    if (!this.cachorro?.photo) {
      return [];
    }

    const photos = Array.isArray(this.cachorro.photo)
      ? this.cachorro.photo
      : [this.cachorro.photo];

    return photos.map(normalizeImageUrl);
  }
}