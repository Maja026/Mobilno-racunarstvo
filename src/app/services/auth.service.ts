import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private auth: Auth,
    private db: Database
  ) {}

  // LOGIN korisnika
  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        console.log('User logged in:', this.auth.currentUser?.email);
      })
      .catch(err => {
        console.error('Login error:', err);
        throw err;
      });
  }

  // REGISTRACIJA korisnika + kreiranje u Realtime DB
  register(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        const uid = userCredential.user.uid;

        // Kreiraj korisnika u Realtime DB
        return set(ref(this.db, `users/${uid}`), {
          uid,
          email,
          watchLater: {},
          seen: {}
        });
      })
      .then(() => {
        console.log('User registered and created in DB');
      })
      .catch(err => {
        console.error('Registration error:', err);
        throw err;
      });
  }

  // LOGOUT korisnika
  logout(): Promise<void> {
    return signOut(this.auth)
      .then(() => console.log('User logged out'))
      .catch(err => {
        console.error('Logout error:', err);
        throw err;
      });
  }

  // UID trenutnog korisnika
  getCurrentUserUid(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }

  // Email trenutnog korisnika
  getCurrentUserEmail(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.email : null;
  }

  // Observable trenutnog korisnika
  getCurrentUser(): Observable<FirebaseUser | null> {
    return of(this.auth.currentUser);
  }
}
