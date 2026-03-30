import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FirebaseHttpService } from './firebase-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private http: FirebaseHttpService
  ) {}

  async register(email: string, password: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    await this.http.put(`users/${user.uid}`, {
      uid: user.uid,
      email: user.email,
      watchLater: {},
      seen: {}
    });
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async getCurrentUserUid(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }

  async getCurrentUserEmail(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? user.email : null;
  }
}
