import { Injectable } from '@angular/core';
import { Firestore, doc, docData, updateDoc, arrayUnion, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../services/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  getUserData(uid: string): Observable<User> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef, { idField: 'uid' }) as Observable<User>;
  }

  // Kreira korisnika ako ne postoji
  async createUserIfNotExists(uid: string, email: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      const newUser: User = {
        uid,
        email,
        watchLater: [],
        seen: []
      };
      await setDoc(userRef, newUser);
    }
  }

  // Dodavanje u Watch Later uz uklanjanje iz Seen ako je tamo
  addToWatchLater(uid: string, movieId: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userRef).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        const seen = data.seen.filter(id => id !== movieId);
        const watchLater = data.watchLater.includes(movieId) ? data.watchLater : [...data.watchLater, movieId];
        return setDoc(userRef, { watchLater, seen }, { merge: true });
      }
      return Promise.reject('User not found');
    });
  }

  // Dodavanje u Seen uz uklanjanje iz Watch Later ako je tamo
  markAsSeen(uid: string, movieId: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userRef).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        const watchLater = data.watchLater.filter(id => id !== movieId);
        const seen = data.seen.includes(movieId) ? data.seen : [...data.seen, movieId];
        return setDoc(userRef, { watchLater, seen }, { merge: true });
      }
      return Promise.reject('User not found');
    });
  }

  // Brisanje iz Watch Later
  removeFromWatchLater(uid: string, movieId: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userRef).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        const watchLater = data.watchLater.filter(id => id !== movieId);
        return setDoc(userRef, { watchLater }, { merge: true });
      }
      return Promise.reject('User not found');
    });
  }

  // Brisanje iz Seen
  removeFromSeen(uid: string, movieId: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userRef).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        const seen = data.seen.filter(id => id !== movieId);
        return setDoc(userRef, { seen }, { merge: true });
      }
      return Promise.reject('User not found');
    });
  }
}
