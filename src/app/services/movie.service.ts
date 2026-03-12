import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from './movie.model';
import { Firestore, collectionData, collection, doc, docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private firestore: Firestore) {}

  // Vrati sve filmove
  getMovies(): Observable<Movie[]> {
    const moviesRef = collection(this.firestore, 'movies');
    return collectionData(moviesRef, { idField: 'id' }) as Observable<Movie[]>;
  }

  // Vrati jedan film po ID-u
  getMovie(id: string): Observable<Movie> {
    const movieDocRef = doc(this.firestore, `movies/${id}`);
    return docData(movieDocRef, { idField: 'id' }) as Observable<Movie>;
  }
}



