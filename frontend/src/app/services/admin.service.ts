import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:3000/api'; // URL base (sin /all)

  constructor(private http: HttpClient) {}

  // Obtener todos los recursos (desde /api/all)
getAll(): Observable<{ ejemplares: any[], ejemplarespedigree: any[] }> {
  return this.http.get<{ ejemplares: any[], ejemplarespedigree: any[] }>('http://localhost:3000/api/all');
}


  // Agregar un nuevo recurso (POST /api/{tipo})
agregarRecurso(tipoRecurso: string, nuevoRecurso: any): Observable<any> {
  return this.http.post<any>(`http://localhost:3000/api/${tipoRecurso}`, nuevoRecurso).pipe(
    catchError(this.handleError)
  );
}

buscarPorNombre(tipo: string, nombre: string): Observable<any[]> {
  return this.http.get<any[]>(`/api/${tipo}?nombre=${encodeURIComponent(nombre)}`);
}


  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}

