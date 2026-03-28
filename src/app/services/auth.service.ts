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

  
  register(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        const uid = userCredential.user.uid;

        
        return set(ref(this.db, `users/${uid}`), {
          uid,
          email,
          watchLater: {},
          seen: {}
        });
      })
      .then(() => {
        console.log('User registered and created in database');
      })
      .catch(err => {
        console.error('Registration error:', err);
        throw err;
      });
  }

  logout(): Promise<void> {
    return signOut(this.auth)
      .then(() => console.log('User logged out'))
      .catch(err => {
        console.error('Logout error:', err);
        throw err;
      });
  }

  getCurrentUserUid(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }

  getCurrentUserEmail(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.email : null;
  }

  getCurrentUser(): Observable<FirebaseUser | null> {
    return of(this.auth.currentUser);
  }
}
