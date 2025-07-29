import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly validUser = 'BrisasDelArrayan';
  private readonly validPass = 'Regalo92-22';

  private loggedIn = false;

  constructor() {}

login(username: string, password: string): boolean {
  return username === this.validUser && password === this.validPass;
}

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout() {
    this.loggedIn = false;
  }
}

