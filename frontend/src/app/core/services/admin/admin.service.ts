import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl;

  getAll(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/all`
    );
  }

  agregarRecurso(
    tipoRecurso: string,
    nuevoRecurso: any
  ): Observable<any> {

    return this.http.post<any>(
      `${this.baseUrl}/${tipoRecurso}`,
      nuevoRecurso
    ).pipe(
      catchError(this.handleError)
    );
  }

  buscarPorNombre(
    tipo: string,
    nombre: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.baseUrl}/${tipo}?nombre=${encodeURIComponent(nombre)}`
    );
  }

  private handleError(error: HttpErrorResponse) {

    console.error('Error:', error);

    return throwError(
      () => new Error('Algo salió mal')
    );
  }
}

