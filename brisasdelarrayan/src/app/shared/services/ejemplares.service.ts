import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


// Define interfaces para tus datos
export interface Ejemplar {
  id: number;
  nombre: string;
  edad: number;
  raza: string;
  // Otros campos que tengas
}

export interface EjemplarPedigree {
  nombre: string;
  id: number;
  fk_idejemplar: number;
  pedigree: string;
  // Otros campos que tengas
}

@Injectable({
  providedIn: 'root'
})
export class EjemplaresService {
  private apiUrl = 'http://192.168.1.219:3000/ejemplares';
  private apiUrlPedigree = 'http://192.168.1.219:3000/ejemplarespedigree';

  constructor(private http: HttpClient) { }

  // Obtener todos los ejemplares
  getEjemplares(): Observable<Ejemplar[]> {
    return this.http.get<Ejemplar[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un ejemplar por su ID
  getEjemplarById(id: number): Observable<Ejemplar> {
    return this.http.get<Ejemplar>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener ejemplares con pedigree
  getEjemplaresPedigree(): Observable<EjemplarPedigree[]> {
    return this.http.get<EjemplarPedigree[]>(this.apiUrlPedigree).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }
}
