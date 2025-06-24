import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';

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

  private apiUrl = 'http://localhost:3000/api/ejemplarespedigree';

  constructor(private http: HttpClient) { }

  getPedigreeById(id: number): Observable<PedigreeResponse> {
    return this.http.get<PedigreeResponse>(`${this.apiUrl}/${id}`).pipe(
      tap(response => {
        console.log('Response del servicio:', response);
      }),
      catchError(error => {
        console.error('Error obteniendo datos del servidor, usando datos estáticos:', error);
        const dummyData: PedigreeResponse = {
          ejemplar: {
            id: id,
            name: 'Ejemplar Demo',
            photo: 'ruta/demo.jpg',
            url: 'http://demo.com',
            titles: 'Campeón Nacional',
            color: 'Negro',
            breed: 'Raza Ejemplo',
            padreId: 0,
            madreId: 0
          },
          pedigree: []
        };
        return of(dummyData);
      })
    );
  }
}
