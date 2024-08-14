import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CamadasService {

  private apiUrl= "http://192.168.1.219:3000/camadas";

  constructor(private http: HttpClient) { }

  getCamadas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }

}
