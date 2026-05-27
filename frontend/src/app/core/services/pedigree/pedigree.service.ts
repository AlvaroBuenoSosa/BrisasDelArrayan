import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  Observable,
  of,
  tap,
  catchError
} from 'rxjs';

import { environment } from '../../../../../environments/environment';

interface Ejemplar {

  id: number;

  name: string;

  photo: string;

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

  photo: string;

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

@Injectable({
  providedIn: 'root'
})
export class PedigreeService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/pedigree`;

  getPedigreeById(
    id: number
  ): Observable<PedigreeResponse> {

    return this.http.get<PedigreeResponse>(
      `${this.apiUrl}/${id}`
    ).pipe(

      tap(response => {
        console.log(response);
      }),

      catchError(error => {

        console.error(error);

        return of({
          ejemplar: {
            id,
            name: 'Demo',
            photo: '',
            url: '',
            titles: '',
            color: '',
            breed: '',
            padreId: 0,
            madreId: 0
          },
          pedigree: []
        });
      })
    );
  }
}
