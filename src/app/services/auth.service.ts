import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private auth: Auth) {}

  // Login korisnika
  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {})
      .catch(err => { throw err; });
  }

  // Registracija korisnika
  register(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(() => {})
      .catch(err => { throw err; });
  }

  // Logout korisnika
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  // Provera da li je korisnik ulogovan
  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  // Dohvata UID trenutnog korisnika
  getCurrentUserUid(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }

  // Opcionalno: observable trenutnog korisnika
  getCurrentUser(): Observable<User | null> {
    return of(this.auth.currentUser);
  }
}
