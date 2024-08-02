import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {
  private apiUrl = 'https://graph.facebook.com/{page-id}/posts';
  private accessToken = '{your-access-token}';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?access_token=${this.accessToken}`);
  }
}
