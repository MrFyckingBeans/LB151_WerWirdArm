// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  setLoggedIn(value: boolean): void {
    localStorage.setItem('loggedIn', value.toString());
  }

  isLoggedIn(): boolean {
    const loggedIn = localStorage.getItem('loggedIn');
    return loggedIn === 'true';
  }

  clearLoggedIn(): void {
    localStorage.removeItem('loggedIn');
  }
}
