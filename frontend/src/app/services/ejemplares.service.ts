import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',  // Esto asegura que el servicio sea un singleton
})
export class EjemplaresService {
  
  private apiUrl = 'http://localhost:3000/api/ejemplares'; // URL de tu API backend
  private apiPedigreeUrl = 'http://localhost:3000/api/ejemplarespedigree';


  constructor(private http: HttpClient) { } // Inyecta el HttpClient

  // Solicitud GET para obtener los ejemplares
  getEjemplares(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEjemplaresPedigree(): Observable<any[]> {
    return this.http.get<any[]>(this.apiPedigreeUrl);
  }

  getEjemplaresPedigreeById(id: number): Observable<any> {
    return this.http.get(`${this.apiPedigreeUrl}/${id}`);
  }

  // Obtener un ejemplar por su ID
  getEjemplarById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`); // Solicitud GET con ID
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }


}




