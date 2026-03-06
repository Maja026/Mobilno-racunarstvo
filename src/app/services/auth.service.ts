import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = false;

  constructor() {}

  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (email && password) {
        this.loggedIn = true;
        resolve();
      } else {
        reject({ message: 'Email i password su obavezni!' });
      }
    });
  }

  register(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (email && password) {
        this.loggedIn = true;
        resolve();
      } else {
        reject({ message: 'Email i password su obavezni!' });
      }
    });
  }

  logout(): Promise<void> {
    return new Promise((resolve) => {
      this.loggedIn = false;
      resolve();
    });
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}

