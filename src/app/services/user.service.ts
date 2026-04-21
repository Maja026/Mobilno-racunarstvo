import { Injectable } from '@angular/core';
import { FirebaseHttpService } from './firebase-http.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: FirebaseHttpService) {}

  async createUserIfNotExists(uid: string, email: string): Promise<void> {
    const user = await this.http.get(`users/${uid}`);

    if (!user) {
      const newUser: User = {
        uid,
        email,
        watchLater: {},
        seen: {}
      };

      await this.http.put(`users/${uid}`, newUser);
    }
  }

  async getUserData(uid: string): Promise<User | null> {
    const user = await this.http.get(`users/${uid}`);
    return user ? (user as User) : null;
  }

  async addToWatchLater(uid: string, movieId: string): Promise<void> {
    await this.http.put(`users/${uid}/watchLater/${movieId}`, true);
  }

  async removeFromWatchLater(uid: string, movieId: string): Promise<void> {
    await this.http.delete(`users/${uid}/watchLater/${movieId}`);
  }

  async markAsSeen(uid: string, movieId: string): Promise<void> {
    await this.http.put(`users/${uid}/seen/${movieId}`, true);
  }

  async removeFromSeen(uid: string, movieId: string): Promise<void> {
    await this.http.delete(`users/${uid}/seen/${movieId}`);
  }
}
