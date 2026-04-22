import { Injectable } from '@angular/core';
import { FirebaseHttpService } from './firebase-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_KEY = "AIzaSyAoLmPiE2Nt4R_gfB7lvGQV1I2x8MjAZ9E";

  constructor(private http: FirebaseHttpService) {}

  async register(email: string, password: string): Promise<void> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;

    const response: any = await this.http.postFullUrl(url, {
      email,
      password,
      returnSecureToken: true
    });

    const uid = response.localId;


    await this.http.put(`users/${uid}`, {
      uid,
      email,
      watchLater: {},
      seen: {}
    });


    localStorage.setItem('token', response.idToken);
    localStorage.setItem('uid', uid);
    localStorage.setItem('email', email);
  }

  async login(email: string, password: string): Promise<void> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;

    const response: any = await this.http.postFullUrl(url, {
      email,
      password,
      returnSecureToken: true
    });

    localStorage.setItem('token', response.idToken);
    localStorage.setItem('uid', response.localId);
    localStorage.setItem('email', email);
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('email');
  }

  async getCurrentUserUid(): Promise<string | null> {
    return localStorage.getItem('uid');
  }

  async getCurrentUserEmail(): Promise<string | null> {
    return localStorage.getItem('email');
  }
}
