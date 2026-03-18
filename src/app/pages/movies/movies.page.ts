import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, 
  IonList, IonItem, IonLabel, IonThumbnail, IonSegment, IonSegmentButton, IonSearchbar 
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { UserService } from '../../services/user.service';
import { Movie } from '../../services/movie.model';
import { User } from '../../services/user.model';

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
    IonSegmentButton,
    IonSearchbar
  ],
})
export class MoviesPage implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  currentUser: User | null = null;
  filter: 'movie' | 'series' = 'movie';
  searchTerm: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private movieService: MovieService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadMovies();
    this.loadCurrentUser();
  }

  private loadMovies() {
    this.movieService.getMovies().subscribe({
      next: data => {
        this.movies = data;
        this.applyFilter();
      },
      error: err => console.error('Error loading movies:', err)
    });
  }

  private loadCurrentUser() {
    this.userService.getUserData().subscribe(user => {
      this.currentUser = user;
    });
  }

  applyFilter() {
    this.filteredMovies = this.movies
      .filter(m => m.type === this.filter)
      .filter(m => m.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  setFilter(type: 'movie' | 'series') {
    this.filter = type;
    this.applyFilter();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.applyFilter();
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/login']));
  }

  addToWatchLater(movieId: string) {
    if (!this.currentUser) return;

    const exists = !!this.currentUser.watchLater?.[movieId];
    const action = exists ? this.userService.removeFromWatchLater(movieId) : this.userService.addToWatchLater(movieId);

    action.then(() => {
      if (!this.currentUser) return;
      if (!this.currentUser.watchLater) this.currentUser.watchLater = {};
      exists ? delete this.currentUser.watchLater[movieId] : this.currentUser.watchLater[movieId] = true;
    }).catch(err => console.error(err));
  }

  markAsSeen(movieId: string) {
    if (!this.currentUser) return;

    const exists = !!this.currentUser.seen?.[movieId];
    const action = exists ? this.userService.removeFromSeen(movieId) : this.userService.markAsSeen(movieId);

    action.then(() => {
      if (!this.currentUser) return;
      if (!this.currentUser.seen) this.currentUser.seen = {};
      exists ? delete this.currentUser.seen[movieId] : this.currentUser.seen[movieId] = true;
    }).catch(err => console.error(err));
  }

  goToDetails(movieId: string) {
    this.router.navigate(['/movie-details', movieId]);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  isMovieSeen(movieId: string): boolean {
    return !!this.currentUser?.seen?.[movieId];
  }

  isMovieInWatchLater(movieId: string): boolean {
    return !!this.currentUser?.watchLater?.[movieId];
  }
}
