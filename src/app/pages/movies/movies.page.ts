import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { UserService } from '../../services/user.service';
import { Movie } from '../../services/movie.model';
import { User } from '../../services/user.model';
import { Router } from '@angular/router';

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

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
  currentUser: User | null = null;

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

}


