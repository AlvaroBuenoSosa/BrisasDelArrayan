import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EjemplaresService {
  private apiUrl= "http://192.168.1.219:3000/ejemplares";
  private URL="http://192.168.1.219:3000/ejemplarespedigree";

  constructor(private http: HttpClient) { }

  getEjemplares(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getEjemplarById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }

  getEjemplaresPedigree(): Observable<any[]> {
    return this.http.get<any[]>(this.URL).pipe(
      catchError(this.handleError)
    );
  }
}
