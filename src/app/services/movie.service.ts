import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie } from './movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  // Dummy podaci za testiranje
  private movies: Movie[] = [
    { id: 1, title: 'Inception', director: 'Christopher Nolan', year: 2010, description: 'Sci-fi thriller' },
    { id: 2, title: 'The Matrix', director: 'Lana Wachowski, Lilly Wachowski', year: 1999, description: 'Sci-fi action' },
    { id: 3, title: 'Interstellar', director: 'Christopher Nolan', year: 2014, description: 'Space epic' }
  ];

  constructor() { }

  getMovies(): Observable<Movie[]> {
    // Ovde kasnije ide REST poziv
    return of(this.movies);
  }

  getMovie(id: number): Observable<Movie | undefined> {
    return of(this.movies.find(m => m.id === id));
  }

  addMovie(movie: Movie): Observable<Movie> {
    movie.id = this.movies.length + 1;
    this.movies.push(movie);
    return of(movie);
  }
}