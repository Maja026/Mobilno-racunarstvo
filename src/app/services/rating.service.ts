import { Injectable } from '@angular/core';
import { Database, ref, set, get } from '@angular/fire/database';

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

  constructor(private db: Database) {}

  addRating(rating: Rating) {
    const ratingRef = ref(this.db, 'ratings/' + rating.userId + '_' + rating.movieId);

    return set(ratingRef, {
      ...rating,
      timestamp: Date.now()
    });
  }

  async getRatingsForMovie(movieId: string): Promise<Rating[]> {

    const ratingsRef = ref(this.db, 'ratings');
    const snapshot = await get(ratingsRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const ratings: Rating[] = [];

    Object.values(data).forEach((rating: any) => {
      if (rating.movieId === movieId) {
        ratings.push(rating);
      }
    });

    return ratings;
  }

}
