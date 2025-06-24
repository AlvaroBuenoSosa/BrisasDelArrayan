import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CamadasService {

  private apiUrl = 'http://localhost:3000/api/camadas'; // URL de tu API backend

  constructor(private http: HttpClient) {} // Inyecta el HttpClient

  getCamadas(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl); // Solicitud GET para obtener los ejemplares
    }
    
}
