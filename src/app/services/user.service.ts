import { Injectable } from '@angular/core';
import { Database, ref, get, set } from '@angular/fire/database';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: Database) {}

  async createUserIfNotExists(uid: string, email: string): Promise<void> {
    const userRef = ref(this.db, `users/${uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      const newUser: User = {
        uid,
        email,
        watchLater: {},
        seen: {}
      };
      await set(userRef, newUser);
    }
  }


  async getUserData(uid: string): Promise<User | null> {
    try {
      const userRef = ref(this.db, `users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return snapshot.val() as User;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user data:', err);
      return null;
    }
  }


  async addToWatchLater(uid: string, movieId: string): Promise<void> {
    const movieRef = ref(this.db, `users/${uid}/watchLater/${movieId}`);
    await set(movieRef, true);
  }


  async removeFromWatchLater(uid: string, movieId: string): Promise<void> {
    const movieRef = ref(this.db, `users/${uid}/watchLater/${movieId}`);
    await set(movieRef, null);
  }


  async markAsSeen(uid: string, movieId: string): Promise<void> {
    const movieRef = ref(this.db, `users/${uid}/seen/${movieId}`);
    await set(movieRef, true);
  }


  async removeFromSeen(uid: string, movieId: string): Promise<void> {
    const movieRef = ref(this.db, `users/${uid}/seen/${movieId}`);
    await set(movieRef, null);
  }
}
