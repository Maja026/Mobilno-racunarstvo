import { Injectable } from '@angular/core';
import { FirebaseHttpService } from './firebase-http.service';

export interface Rating {
  movieId: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: FirebaseHttpService) {}


  async addRating(rating: Rating): Promise<void> {
    const ratingId = `${rating.userId}_${rating.movieId}`;
    await this.http.put(`ratings/${ratingId}`, {
      ...rating,
      timestamp: Date.now()
    });
  }


  async getRatingsForMovie(movieId: string): Promise<Rating[]> {
    const data = await this.http.get('ratings');
    if (!data) return [];

    const ratingsObj: { [key: string]: any } = data;
    const ratings: Rating[] = [];

    Object.keys(ratingsObj).forEach(key => {
      const r = ratingsObj[key];
      if (r.movieId === movieId) {
        ratings.push({
          movieId: r.movieId,
          userId: r.userId,
          rating: r.rating,
          comment: r.comment,
          timestamp: r.timestamp || 0
        });
      }
    });

    return ratings;
  }
}
