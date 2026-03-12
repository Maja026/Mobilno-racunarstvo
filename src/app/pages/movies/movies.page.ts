import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../services/movie.model';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common'; // <-- dodaj ovo

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [
    CommonModule,    // <-- dodaj
    RouterModule,    // <-- dodaj za routerLink
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail
  ],
})
export class MoviesPage implements OnInit {
  movies: Movie[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private movieService: MovieService
  ) {}

ngOnInit() {
  this.movieService.getMovies().subscribe({
    next: data => {
      this.movies = data;
      console.log('Movies loaded:', this.movies);
    },
    error: err => {
      console.error('Firestore error:', err);
    }
  });
}


  logout() {
    this.authService.logout()
      .then(() => this.router.navigate(['/login']))
      .catch(err => alert(err.message));
  }
}
