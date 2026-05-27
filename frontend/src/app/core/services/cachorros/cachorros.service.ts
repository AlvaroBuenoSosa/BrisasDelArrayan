import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface Cachorro {
  id: number;

  nombre: string;

  raza: string;

  photo: string;

  color: string;

  sexo: 'Macho' | 'Hembra';

  fechaNacimiento: string;

  padreId: number;

  madreId: number;

  camadaId: number;

  padreNombre?: string;

  madreNombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CachorrosService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/cachorros`;

  getCachorros(): Observable<Cachorro[]> {
    return this.http.get<Cachorro[]>(this.apiUrl);
  }

  getCachorroBySlug(slug: string): Observable<Cachorro | undefined> {
    return this.getCachorros().pipe(
      map(cachorros =>
        cachorros.find(
          cachorro =>
            this.formatNombreParaUrl(cachorro.nombre) === slug
        )
      )
    );
  }

  getCachorrosPorCamada(camadaId: number): Observable<Cachorro[]> {
    return this.getCachorros().pipe(
      map(cachorros =>
        cachorros.filter(
          cachorro => cachorro.camadaId === camadaId
        )
      )
    );
  }

  private formatNombreParaUrl(nombre: string): string {
    return nombre
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');
  }
}
