import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, pipe, throwError } from 'rxjs';
import { Cachorro } from '../components/cachorros/cachorros.component';

@Injectable({
  providedIn: 'root'
})
export class CachorrosService {

  private apiUrl = 'http://localhost:3000/api/cachorros'; // URL de tu API backend

  constructor(private http: HttpClient) {} // Inyecta el HttpClient

  getCachorros(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl).pipe(
        catchError(this.handleError) // Solicitud GET para obtener los ejemplares
      );
    }

    getCachorroById(id: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

  getCachorrosPorCamada(padreId: number, madreId: number) {
  return this.http.get<Cachorro[]>(`http://localhost:3000/api/cachorros-por-camada`, {
    params: { padreId, madreId }
  });
}
  
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }
    
}
