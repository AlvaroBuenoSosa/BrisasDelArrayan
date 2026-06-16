import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { normalizeImageUrl } from '../../../../shared/utils/image-url.util';
import { Camada } from '../../interfaces/camada.interface';

@Component({
  selector: 'app-camada-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camada-card.component.html',
  styleUrls: ['./camada-card.component.scss']
})
export class CamadaCardComponent {

  @Input({ required: true })
  camada!: Camada;

  @Output()
  selected = new EventEmitter<number>();

  onSelect(): void {
    this.selected.emit(this.camada.id);
  }

  getPhoto(photo: string): string {
    return normalizeImageUrl(photo);
  }
}