import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import {
  catchError,
  Observable,
  throwError
} from 'rxjs';

import { environment } from '../../../../environments/environment';

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
      `${this.baseUrl}/admin/${tipoRecurso}`,
      nuevoRecurso
    ).pipe(
      catchError(this.handleError)
    );
  }

  actualizarRecurso(
    tipo: string,
    id: number,
    data: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.baseUrl}/admin/${tipo}/${id}`,
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  eliminarPorId(
    tipo: string,
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.baseUrl}/admin/${tipo}/${id}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  eliminarPorNombre(
    tipo: string,
    nombre: string
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.baseUrl}/admin/${tipo}/name/${encodeURIComponent(nombre)}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(
    error: HttpErrorResponse
  ) {

    console.error(error);

    return throwError(
      () => new Error('Algo salió mal')
    );
  }
}



