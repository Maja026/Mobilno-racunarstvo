import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, query, where, getDocs, Timestamp } from '@angular/fire/firestore';

export interface Rating {
  movieId: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp?: any;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private firestore: Firestore) {}

  // Dodavanje ili izmena ocene
  addRating(rating: Rating) {
    const docRef = doc(this.firestore, `ratings/${rating.userId}_${rating.movieId}`);
    return setDoc(docRef, {
      ...rating,
      timestamp: Timestamp.now()  // automatsko vreme Firestore
    });
  }

  // Dohvati sve ocene za jedan film
  async getRatingsForMovie(movieId: string): Promise<Rating[]> {
    const q = query(collection(this.firestore, 'ratings'), where('movieId', '==', movieId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Rating);
  }
}
