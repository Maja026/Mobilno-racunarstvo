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


  async getAllRatings(): Promise<Rating[]> {
    const data = await this.http.get('ratings');
    if (!data) return [];

    const ratingsObj: { [key: string]: any } = data;

    return Object.keys(ratingsObj).map(key => ({
      movieId: ratingsObj[key].movieId,
      userId: ratingsObj[key].userId,
      rating: ratingsObj[key].rating,
      comment: ratingsObj[key].comment,
      timestamp: ratingsObj[key].timestamp || 0
    }));
  }

  async updateRating(ratingId: string, rating: Rating): Promise<void> {
    await this.http.put(`ratings/${ratingId}`, {
      ...rating,
      timestamp: Date.now()
    });
  }


  async deleteRating(ratingId: string): Promise<void> {
    await this.http.delete(`ratings/${ratingId}`);
  }
}
