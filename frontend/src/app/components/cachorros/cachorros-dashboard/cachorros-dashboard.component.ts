import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CachorrosService } from '../../../services/cachorros.service';
import { EjemplaresService } from '../../../services/ejemplares.service';

@Component({
  selector: 'app-cachorros-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cachorros-dashboard.component.html',
  styleUrls: ['./cachorros-dashboard.component.scss']
})
export class CachorrosDashboardComponent implements OnInit {

  cachorros: any[] = [];
  selectedCachorro: any = null;
  cachorrosPedigree: any[] = [];
  maxPedigreeCount = 30;
  idCounts: { [id: number]: number } = {};
  nameCounts: { [name: string]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private cachorrosService: CachorrosService,
    private ejemplaresService: EjemplaresService,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.cachorrosService.getCachorros().subscribe(data => {
      this.cachorros = data;
      this.route.paramMap.subscribe(params => {
        const nombreFormateado = params.get('nombre');
        if (nombreFormateado) {
          this.selectedCachorro = this.cachorros.find(e =>
            this.formatNombreParaUrl(e.nombre) === nombreFormateado
          );

          if (this.selectedCachorro) {
            this.loadCachorrosPedigree(this.selectedCachorro.id);
          }
        }
      });
    });
  }

  loadCachorrosPedigree(idCachorroSeleccionado: number): void {
    this.cachorrosService.getCachorros().subscribe(cachorrosData => {
      this.ejemplaresService.getEjemplares().subscribe(ejemplaresData => {
        this.ejemplaresService.getEjemplaresPedigree().subscribe(pedigreeData => {
          const cachorroSeleccionado = cachorrosData.find(c => c.id === idCachorroSeleccionado);
          if (!cachorroSeleccionado) return;

          const obtenerAntepasados = (id: number, tipo: string): any[] => {
            let ejemplar = ejemplaresData.find(e => e.id === id) || pedigreeData.find(p => p.id === id);
            if (!ejemplar) return [];

            let antepasados: any[] = [{ ...ejemplar, tipo }];

            if (ejemplar.padreId) {
              antepasados = [...antepasados, ...obtenerAntepasados(ejemplar.padreId, 'Padre')];
            }

            if (ejemplar.madreId) {
              antepasados = [...antepasados, ...obtenerAntepasados(ejemplar.madreId, 'Madre')];
            }

            return antepasados;
          };

          let pedigreeFiltrado: any[] = [];

          if (cachorroSeleccionado.padreId) {
            pedigreeFiltrado = [...pedigreeFiltrado, ...obtenerAntepasados(cachorroSeleccionado.padreId, 'Padre')];
          }

          if (cachorroSeleccionado.madreId) {
            pedigreeFiltrado = [...pedigreeFiltrado, ...obtenerAntepasados(cachorroSeleccionado.madreId, 'Madre')];
          }

          this.cachorrosPedigree = this.sortAndFillPedigrees(pedigreeFiltrado);
          this.idCounts = this.getIdCounts();
          this.nameCounts = this.getNameCounts();

          this.generatePedigreeTable(cachorroSeleccionado);
        });
      });
    });
  }

  sortAndFillPedigrees(pedigrees: any[]): any[] {
    const sorted = pedigrees.sort((a, b) => a.id - b.id);
    if (sorted.length === 0) return [];

    const firstId = sorted[0].id;
    const lastId = firstId + this.maxPedigreeCount - 1;

    const filled = [...sorted];
    const existingIds = new Set(sorted.map(p => p.id));

    for (let id = firstId; id <= lastId; id++) {
      if (!existingIds.has(id)) {
        filled.push({
          id,
          name: '',
          photo: '',
          url: '',
          titles: '',
          color: '',
          breed: '',
          padreId: null,
          madreId: null
        });
      }
    }

    return filled.sort((a, b) => a.id - b.id);
  }

  getEjemplarById(id: number | null): any | null {
    if (id === null) return null;
    return this.cachorrosPedigree.find(e => e.id === id) || null;
  }

  getIdCounts(): { [id: number]: number } {
    const counts: { [id: number]: number } = {};
    this.cachorrosPedigree.forEach(ej => {
      if (ej && ej.id) {
        counts[ej.id] = (counts[ej.id] || 0) + 1;
      }
    });
    return counts;
  }

  getNameCounts(): { [name: string]: number } {
    const counts: { [name: string]: number } = {};
    this.cachorrosPedigree.forEach(ej => {
      if (ej && ej.name) {
        counts[ej.name] = (counts[ej.name] || 0) + 1;
      }
    });
    return counts;
  }

  getSexualRepetitionClass(member: any): string {
    if (!member || !member.name) return '';

    const count = this.nameCounts[member.name] || 0;
    if (count < 2) return '';

    const isMale = this.cachorrosPedigree.some(p => p.padreId === member.id);
    const isFemale = this.cachorrosPedigree.some(p => p.madreId === member.id);

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

  generatePedigreeTable(ejemplar: any) {
    const container = this.elRef.nativeElement.querySelector('#pedigreeTable');
    this.renderer.setProperty(container, 'innerHTML', '');

    const getParents = (ej: any | null): (any | null)[] => {
      if (!ej) return [null, null];
      return [this.getEjemplarById(ej.padreId), this.getEjemplarById(ej.madreId)];
    };

    const father = this.getEjemplarById(ejemplar.padreId);
    const mother = this.getEjemplarById(ejemplar.madreId);
    const level1 = [father, mother];

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

    const level4: (any | null)[] = [];
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

          // Aquí: si photo es array, toma el primero
          const photoUrl = Array.isArray(member.photo) ? member.photo[0] || '' : member.photo || '';

          cellDiv.innerHTML = `
            <div class="name"><a href="${member.url}">${member.name}</a></div>
            <div class="photo"><a href="${member.url}"><img width="120" src="${photoUrl}" alt="${member.name}"></a></div>
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

  formatNombreParaUrl(nombre: string): string {
    return nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  }
}



