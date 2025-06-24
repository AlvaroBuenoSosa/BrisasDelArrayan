import { Component, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedigreeService } from '../../services/pedigree.service';

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

interface PedigreeResponse {
  ejemplar: Ejemplar;
  pedigree: EjemplarPedigree[];
}

@Component({
  selector: 'app-pedigree',
  standalone: true,
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
    if (Array.isArray(photo)) {
      return photo.length > 0 ? photo[0] : '';
    }
    return photo;
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
    this.pedigreeArray.forEach(ej => {
      if (ej && ej.id) {
        counts[ej.id] = (counts[ej.id] || 0) + 1;
      }
    });
    return counts;
  }

  getNameCounts(): { [name: string]: number } {
    const counts: { [name: string]: number } = {};
    this.pedigreeArray.forEach(ej => {
      if (ej && ej.name) {
        counts[ej.name] = (counts[ej.name] || 0) + 1;
      }
    });
    return counts;
  }

  getSexualRepetitionClass(member: EjemplarPedigree): string {
    if (!member || !member.name) return '';

    const count = this.nameCounts[member.name] || 0;
    if (count < 2) return '';

    const isMale = this.pedigreeArray.some(p => p.padreId === member.id);
    const isFemale = this.pedigreeArray.some(p => p.madreId === member.id);

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

  generatePedigreeTable() {
    const container = this.elRef.nativeElement.querySelector('#pedigreeTable');
    this.renderer.setProperty(container, 'innerHTML', '');
    if (!this.ejemplar) return;

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

    const pedigreeLevels = [level1, level2, level3, level4];

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
        this.renderer.setStyle(cellDiv, 'border', '1px solid #333');
        this.renderer.setStyle(cellDiv, 'padding', '5px');
        this.renderer.setStyle(cellDiv, 'textAlign', 'center');
        this.renderer.setStyle(cellDiv, 'overflow', 'hidden');

        this.renderer.setStyle(cellDiv, 'display', 'flex');
        this.renderer.setStyle(cellDiv, 'flexDirection', 'column');
        this.renderer.setStyle(cellDiv, 'alignItems', 'center');
        this.renderer.setStyle(cellDiv, 'justifyContent', 'center');

        if (member) {
          const repetitionClass = this.getSexualRepetitionClass(member);
          if (repetitionClass) {
            this.renderer.addClass(cellDiv, repetitionClass);
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



