import { Injectable } from '@angular/core';
import { FirebaseHttpService } from './firebase-http.service';

export interface Movie {
  id: string;
  title: string;
  type: string;
  description?: string;
  imageURL?: string;
  director?: string;
  year?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: FirebaseHttpService) {}

  async getMovies(): Promise<Movie[]> {
    const data = await this.http.get('movies'); 
    if (!data) return [];

    const moviesObj: { [key: string]: any } = data;

    return Object.keys(moviesObj).map(key => ({
      id: key,
      title: moviesObj[key].title,
      type: moviesObj[key].type,
      description: moviesObj[key].description || '',
      imageURL: moviesObj[key].imageURL || '',
      director: moviesObj[key].director || '',
      year: moviesObj[key].year || 0
    }));
  }

  async getMovie(id: string): Promise<Movie | null> {
    const movieData = await this.http.get(`movies/${id}`); 
    if (!movieData) return null;

    const movieObj: any = movieData;

    return {
      id,
      title: movieObj.title,
      type: movieObj.type,
      description: movieObj.description || '',
      imageURL: movieObj.imageURL || '',
      director: movieObj.director || '',
      year: movieObj.year || 0
    };
  }

  async addMovie(movie: Omit<Movie, 'id'>): Promise<string> {
    const newId = await this.http.post('movies', movie); 
    return newId;
  }

  async updateMovie(id: string, movie: Partial<Omit<Movie, 'id'>>): Promise<void> {
    await this.http.put(`movies/${id}`, movie);
  }

  async deleteMovie(id: string): Promise<void> {
    await this.http.delete(`movies/${id}`);
  }
}
