import { Component, Input, OnInit, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedigreeService } from '../../../core/services/pedigree/pedigree.service';

import { normalizeImageUrl } from '../../utils/image-url.util';

interface Ejemplar {
  id: number;
  name: string;
  photo: string | string[];  // Cambiado a string o array
  url: string;
  titles: string;
  color: string;
  breed: string;
  padreId: number;
  madreId: number;
}

interface EjemplarPedigree {
  id: number;
  name: string;
  photo: string | string[];  // Cambiado a string o array
  url: string;
  titles: string;
  color: string;
  breed: string;
  padreId: number | null;
  madreId: number | null;
  ejemplarId: number;
}

@Component({
  selector: 'app-pedigree',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  templateUrl: './pedigree.component.html',
  styleUrls: ['./pedigree.component.scss']
})
export class PedigreeComponent implements OnInit {
  @Input() ejemplarId!: number;
  ejemplar?: Ejemplar;
  pedigreeArray: EjemplarPedigree[] = [];
  maxPedigreeCount = 30;
  idCounts: { [id: number]: number } = {};
  nameCounts: { [name: string]: number } = {};

  constructor(
    private pedigreeService: PedigreeService,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (this.ejemplarId) {
      this.pedigreeService.getPedigreeById(this.ejemplarId).subscribe({
        next: (response) => {
          this.ejemplar = response.ejemplar;
          this.pedigreeArray = this.sortAndFillPedigrees(response.pedigree);
          this.idCounts = this.getIdCounts();
          this.nameCounts = this.getNameCounts();
          this.generatePedigreeTable();
        },
        error: (err) => console.error('Error loading pedigree:', err)
      });
    }

    (window as any).setComponent = (id: number) => {
      console.log('Clicked on ID:', id);
    };
  }

  // Nueva función para obtener la foto principal
  getPrimaryPhoto(photo: string | string[]): string {
    if (!photo) return '';

    const primaryPhoto = Array.isArray(photo)
      ? photo.length > 0 ? photo[0] : ''
      : photo;

    return normalizeImageUrl(primaryPhoto);
  }

  sortAndFillPedigrees(pedigrees: EjemplarPedigree[]): EjemplarPedigree[] {
    const sortedPedigrees = pedigrees.sort((a, b) => a.id - b.id);
    if (sortedPedigrees.length === 0) return [];

    const firstId = sortedPedigrees[0].id;
    const lastId = firstId + this.maxPedigreeCount - 1;

    const filledPedigrees = [...sortedPedigrees];
    const existingIds = new Set(sortedPedigrees.map(p => p.id));

    for (let id = firstId; id <= lastId; id++) {
      if (!existingIds.has(id)) {
        filledPedigrees.push({
          id,
          name: '',
          photo: '',
          url: '',
          titles: '',
          color: '',
          breed: '',
          padreId: null,
          madreId: null,
          ejemplarId: 0,
        });
      }
    }

    return filledPedigrees.sort((a, b) => a.id - b.id);
  }

  getEjemplarById(id: number | null): EjemplarPedigree | null {
    if (id === null) return null;
    return this.pedigreeArray.find(e => e.id === id) || null;
  }

  getIdCounts(): { [id: number]: number } {
    const counts: { [id: number]: number } = {};
    const levelIds = this.generatePedigreeLevels().flat().filter(Boolean).map(e => e!.id);
    levelIds.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }

  getNameCounts(): { [name: string]: number } {
    const counts: { [name: string]: number } = {};
    const levelNames = this.generatePedigreeLevels().flat().filter(Boolean).map(e => e!.name);
    levelNames.forEach(name => {
      if (name) {
        counts[name] = (counts[name] || 0) + 1;
      }
    });
    return counts;
  }

  getSexualRepetitionClass(member: EjemplarPedigree): string {
    if (!member || !member.name) return '';

    const idCount = this.idCounts[member.id] || 0;
    const nameCount = this.nameCounts[member.name] || 0;
    const count = Math.max(idCount, nameCount);
    if (count < 2) return '';

    const isMale = this.pedigreeArray.some(p => p.padreId === member.id);
    const isFemale = this.pedigreeArray.some(p => p.madreId === member.id);

    if (isMale && !isFemale) {
      if (count === 2) return 'maletwice';
      if (count === 3) return 'malethree';
      if (count >= 4) return 'malefour';
    }

    if (isFemale && !isMale) {
      if (count === 2) return 'femaletwise';
      if (count === 3) return 'femalethree';
      if (count >= 4) return 'femalefour';
    }

    if (isMale) {
      if (count === 2) return 'maletwice';
      if (count === 3) return 'malethree';
      if (count >= 4) return 'malefour';
    }

    if (isFemale) {
      if (count === 2) return 'femaletwise';
      if (count === 3) return 'femalethree';
      if (count >= 4) return 'femalefour';
    }

    return '';
  }

  getRepetitionStyles(className: string): { [key: string]: string } {
    const styleMap: { [key: string]: { [key: string]: string } } = {
      maletwice: { backgroundColor: '#d0eaff', borderColor: '#3498db' },
      malethree: { backgroundColor: '#b3d7ff', borderColor: '#2980b9' },
      malefour: { backgroundColor: '#93c3ff', borderColor: '#1c638d' },
      femaletwise: { backgroundColor: '#fce4ec', borderColor: '#e91e63' },
      femalethree: { backgroundColor: '#f8bdd7', borderColor: '#c2185b' },
      femalefour: { backgroundColor: '#f497c5', borderColor: '#880e4f' }
    };

    return styleMap[className] || {};
  }

  private generatePedigreeLevels(): (EjemplarPedigree | null)[][] {
    if (!this.ejemplar) return [];

    const father = this.getEjemplarById(this.ejemplar.padreId);
    const mother = this.getEjemplarById(this.ejemplar.madreId);
    const level1 = [father, mother];

    const getParents = (ej: EjemplarPedigree | null): (EjemplarPedigree | null)[] => {
      if (!ej) return [null, null];
      return [this.getEjemplarById(ej.padreId), this.getEjemplarById(ej.madreId)];
    };

    const paternalGrandfather = father ? this.getEjemplarById(father.padreId) : null;
    const paternalGrandmother = father ? this.getEjemplarById(father.madreId) : null;
    const maternalGrandfather = mother ? this.getEjemplarById(mother.padreId) : null;
    const maternalGrandmother = mother ? this.getEjemplarById(mother.madreId) : null;
    const level2 = [paternalGrandfather, paternalGrandmother, maternalGrandfather, maternalGrandmother];

    const level3 = [
      ...getParents(paternalGrandfather),
      ...getParents(paternalGrandmother),
      ...getParents(maternalGrandfather),
      ...getParents(maternalGrandmother)
    ];

    const level4: (EjemplarPedigree | null)[] = [];
    for (const ej of level3) {
      level4.push(...getParents(ej));
    }

    return [level1, level2, level3, level4];
  }

  generatePedigreeTable() {
    const container = this.elRef.nativeElement.querySelector('#pedigreeTable');
    this.renderer.setProperty(container, 'innerHTML', '');
    if (!this.ejemplar) return;

    const pedigreeLevels = this.generatePedigreeLevels();

    const flexContainer = this.renderer.createElement('div');
    this.renderer.setStyle(flexContainer, 'display', 'flex');
    this.renderer.setStyle(flexContainer, 'height', `${30 * 100}px`);
    this.renderer.setStyle(flexContainer, 'gap', '8px');

    pedigreeLevels.forEach((level) => {
      const colDiv = this.renderer.createElement('div');
      this.renderer.setStyle(colDiv, 'display', 'flex');
      this.renderer.setStyle(colDiv, 'flexDirection', 'column');
      this.renderer.setStyle(colDiv, 'flex', '1');
      this.renderer.setStyle(colDiv, 'gap', '8px');

      level.forEach(member => {
        const cellDiv = this.renderer.createElement('div');
        this.renderer.setStyle(cellDiv, 'flex', '1 1 0');
        this.renderer.addClass(cellDiv, 'pedigree-cell');

        if (!member) {
          this.renderer.setStyle(cellDiv, 'minHeight', '120px');
        }

        if (member) {
          const repetitionClass = this.getSexualRepetitionClass(member);
          if (repetitionClass) {
            this.renderer.addClass(cellDiv, repetitionClass);
            const repetitionStyles = this.getRepetitionStyles(repetitionClass);
            Object.entries(repetitionStyles).forEach(([styleName, styleValue]) => {
              this.renderer.setStyle(cellDiv, styleName, styleValue);
            });
          }

          cellDiv.innerHTML = `
            <div class="name"><a href="${member.url}">${member.name}</a></div>
            <div class="photo"><a href="${member.url}"><img width="120" src="${this.getPrimaryPhoto(member.photo)}" alt="${member.name}"></a></div>
            <div class="titles"><b>${member.titles}</b></div>
            <div class="name" style="font-size: x-small;"><i>${member.color}<br>${member.breed}</i></div>
          `;
        } else {
          cellDiv.innerHTML = '&nbsp;';
        }

        this.renderer.appendChild(colDiv, cellDiv);
      });

      this.renderer.appendChild(flexContainer, colDiv);
    });

    this.renderer.appendChild(container, flexContainer);
  }       
}



