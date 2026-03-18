import { Injectable } from '@angular/core';
import { Database, ref, set, remove, get } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: Database, private auth: Auth) {}

  async createUserIfNotExists(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;

    const userRef = ref(this.db, `users/${currentUser.uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      await set(userRef, {
        uid: currentUser.uid,
        email: currentUser.email,
        watchLater: {},
        seen: {}
      });
    }
  }

  getUserData(): Observable<User | null> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return of(null);

    const userRef = ref(this.db, `users/${currentUser.uid}`);
    return from(get(userRef)).pipe(
      map(snapshot => snapshot.exists() ? snapshot.val() as User : null)
    );
  }

  async addToWatchLater(movieId: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;
    await set(ref(this.db, `users/${currentUser.uid}/watchLater/${movieId}`), true);
  }

  async removeFromWatchLater(movieId: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;
    await remove(ref(this.db, `users/${currentUser.uid}/watchLater/${movieId}`));
  }

  async markAsSeen(movieId: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;
    await set(ref(this.db, `users/${currentUser.uid}/seen/${movieId}`), true);
  }

  async removeFromSeen(movieId: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;
    await remove(ref(this.db, `users/${currentUser.uid}/seen/${movieId}`));
  }

  getSeenMovies(): Observable<string[]> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return of([]);
    const seenRef = ref(this.db, `users/${currentUser.uid}/seen`);
    return from(get(seenRef)).pipe(
      map(snapshot => snapshot.exists() ? Object.keys(snapshot.val()) : [])
    );
  }

  getWatchLaterMovies(): Observable<string[]> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return of([]);
    const watchLaterRef = ref(this.db, `users/${currentUser.uid}/watchLater`);
    return from(get(watchLaterRef)).pipe(
      map(snapshot => snapshot.exists() ? Object.keys(snapshot.val()) : [])
    );
  }

  async isMovieSeen(movieId: string): Promise<boolean> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return false;
    const snapshot = await get(ref(this.db, `users/${currentUser.uid}/seen/${movieId}`));
    return snapshot.exists();
  }

  async isMovieInWatchLater(movieId: string): Promise<boolean> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return false;
    const snapshot = await get(ref(this.db, `users/${currentUser.uid}/watchLater/${movieId}`));
    return snapshot.exists();
  }
}
