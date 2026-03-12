
import { Injectable } from '@angular/core';
import { Firestore, doc, docData, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../services/user.model';  // ovo si već ispravila

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  getUserData(uid: string): Observable<User> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef, { idField: 'uid' }) as Observable<User>;
  }

  addToWatchLater(uid: string, movieId: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, {
      watchLater: arrayUnion(movieId)
    });
  }

  markAsSeen(uid: string, movieId: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, {
      seen: arrayUnion(movieId)
    });
  }
}
