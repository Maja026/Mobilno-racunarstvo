import { Injectable } from '@angular/core';
import { Database, ref, objectVal, listVal } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from './movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private db: Database) {}

  
  getMovies(): Observable<Movie[]> {
    const moviesRef = ref(this.db, 'movies');

    return listVal<Omit<Movie, 'id'>>(moviesRef, { keyField: 'id' }).pipe(
      map((moviesArray) =>
        moviesArray.map(movie => ({
          id: (movie as any).id,
          title: movie.title,
          type: movie.type,
          description: movie.description || '',
          imageURL: movie.imageURL || '',
          director: movie.director || '',
          year: movie.year || 0
        }))
      )
    );
  }

  
  getMovie(id: string): Observable<Movie> {
    const movieRef = ref(this.db, `movies/${id}`);
    return objectVal<Omit<Movie, 'id'>>(movieRef).pipe(
      map(movie => ({
        id,
        title: movie?.title || '',
        type: movie?.type || 'movie',
        description: movie?.description || '',
        imageURL: movie?.imageURL || '',
        director: movie?.director || '',
        year: movie?.year || 0
      }))
    );
  }
}
