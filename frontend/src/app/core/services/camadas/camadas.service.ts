import { HttpClient } from '@angular/common/http';

import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CamadasService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/camadas`;

  getCamadas(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl
    );
  }
}
