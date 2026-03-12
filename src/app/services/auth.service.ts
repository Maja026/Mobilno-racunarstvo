import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  // Login korisnika
  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {})
      .catch(err => { throw err; });
  }

  // Registracija korisnika + pravljenje dokumenta u Firestore
  register(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {

        const uid = userCredential.user.uid;

        return setDoc(doc(this.firestore, 'users', uid), {
          email: email,
          watchLater: [],
          seen: []
        });

      })
      .then(() => {})
      .catch(err => { throw err; });
  }

  // Logout
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  // Provera da li je korisnik ulogovan
  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  // UID trenutnog korisnika
  getCurrentUserUid(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }

  // Observable korisnika
  getCurrentUser(): Observable<User | null> {
    return of(this.auth.currentUser);
  }
}
