import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { UserService } from '../../services/user.service';
import { Movie } from '../../services/movie.model';
import { User } from '../../services/user.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  IonThumbnail,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonSegment,
    IonSegmentButton
  ],
})
export class MoviesPage implements OnInit {

  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  currentUser: User | null = null;
  filter: 'movie' | 'series' = 'movie'; // default filter

  constructor(
    private router: Router,
    private authService: AuthService,
    private movieService: MovieService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.movieService.getMovies().subscribe({
      next: data => {
        this.movies = data;
        this.applyFilter();
        console.log('Movies loaded:', this.movies);
      },
      error: err => console.error(err)
    });

    const uid = this.authService.getCurrentUserUid();
    if (uid) {
      this.userService.getUserData(uid).subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  applyFilter() {
    this.filteredMovies = this.movies.filter(m => m.type === this.filter);
  }

  setFilter(type: 'movie' | 'series') {
    this.filter = type;
    this.applyFilter();
  }

  logout() {
    this.authService.logout()
      .then(() => this.router.navigate(['/login']));
  }

  addToWatchLater(movieId: string) {
    if (!this.currentUser) return;

    this.userService.addToWatchLater(this.currentUser.uid, movieId)
      .then(() => console.log('Added to Watch Later'));
  }

  markAsSeen(movieId: string) {
    if (!this.currentUser) return;

    this.userService.markAsSeen(this.currentUser.uid, movieId)
      .then(() => console.log('Marked as Seen'));
  }

  goToDetails(movieId: string) {
    this.router.navigate(['/movie-details', movieId]);
  }

  goToProfile() {
  this.router.navigate(['/profile']);
}


}
