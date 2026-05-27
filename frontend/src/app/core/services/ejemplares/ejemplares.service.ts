import { Injectable, inject } from '@angular/core';

import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';

import {
  catchError,
  Observable,
  throwError
} from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EjemplaresService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/ejemplares`;

  private apiPedigreeUrl =
    `${environment.apiUrl}/ejemplarespedigree`;

  getEjemplares(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  getEjemplaresPedigree(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiPedigreeUrl
    );
  }

  getEjemplaresPedigreeById(
    id: number
  ): Observable<any> {

    return this.http.get(
      `${this.apiPedigreeUrl}/${id}`
    );
  }

  getEjemplarById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  private handleError(
    error: HttpErrorResponse
  ) {

    console.error(error);

    return throwError(
      () => new Error('Error del servidor')
    );
  }
}




