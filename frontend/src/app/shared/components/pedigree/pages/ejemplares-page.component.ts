import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  PedigreeMember,
  PedigreeResponse
} from '../interfaces/pedigree.interface';

import { PedigreeService } from '../../../../core/services/pedigree/pedigree.service';

import {
  getParents,
  getPrimaryPhoto,
  countRepeatedNames,
  getPedigreeMemberById
} from '../utils/pedigree.utils';

@Component({
  selector: 'app-pedigree-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedigree-table.component.html',
  styleUrls: ['./pedigree-table.component.scss']
})
export class PedigreeTableComponent implements OnChanges {

  @Input() ejemplarId!: number;

  ejemplar?: PedigreeMember;

  pedigree: PedigreeMember[] = [];

  pedigreeLevels: (PedigreeMember | null)[][] = [];

  repeatedNames: Record<string, number> = {};

  constructor(
    private pedigreeService: PedigreeService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['ejemplarId']?.currentValue) {
      this.loadPedigree();
    }
  }

  private loadPedigree(): void {

    this.pedigreeService.getPedigreeById(this.ejemplarId)
      .subscribe({

        next: (response: PedigreeResponse) => {

          this.ejemplar = response.ejemplar;

          this.pedigree = response.pedigree;

          this.repeatedNames = countRepeatedNames(this.pedigree);

          this.buildPedigreeLevels();
        },

        error: (error) => {
          console.error('Error loading pedigree:', error);
        }
      });
  }

  private buildPedigreeLevels(): void {

    if (!this.ejemplar) return;

    const father = getPedigreeMemberById(
      this.pedigree,
      this.ejemplar.padreId
    );

    const mother = getPedigreeMemberById(
      this.pedigree,
      this.ejemplar.madreId
    );

    const level1 = [father, mother];

    const level2 = [
      ...getParents(this.pedigree, father),
      ...getParents(this.pedigree, mother)
    ];

    const level3: (PedigreeMember | null)[] = [];

    level2.forEach(member => {
      level3.push(...getParents(this.pedigree, member));
    });

    const level4: (PedigreeMember | null)[] = [];

    level3.forEach(member => {
      level4.push(...getParents(this.pedigree, member));
    });

    this.pedigreeLevels = [
      level1,
      level2,
      level3,
      level4
    ];
  }

  getPhoto(photo: string | string[]): string {
    return getPrimaryPhoto(photo);
  }

  getRepeatedClass(member: PedigreeMember | null): string {

    if (!member) return '';

    const count = this.repeatedNames[member.name] || 0;

    if (count < 2) return '';

    const isMale = this.pedigree.some(
      p => p.padreId === member.id
    );

    const isFemale = this.pedigree.some(
      p => p.madreId === member.id
    );

    if (isMale) {

      if (count === 2) return 'male-twice';
      if (count === 3) return 'male-three';
      if (count >= 4) return 'male-four';
    }

    if (isFemale) {

      if (count === 2) return 'female-twice';
      if (count === 3) return 'female-three';
      if (count >= 4) return 'female-four';
    }

    return '';
  }
}