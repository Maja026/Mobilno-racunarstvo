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

  async ngOnInit() {
    await this.loadCurrentUser();
    await this.loadMovies();
  }

  private async loadMovies() {
    try {
      this.movies = await this.movieService.getMovies();
      this.applyFilter();
    } catch (err) {
      console.error('Error loading movies:', err);
    }
  }

  private async loadCurrentUser() {
    try {
      const uid = await this.authService.getCurrentUserUid();
      if (!uid) return;

      this.currentUser = await this.userService.getUserData(uid);
    } catch (err) {
      console.error('Error loading user:', err);
    }
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

  async addToWatchLater(movieId: string) {
    if (!this.currentUser || !this.currentUser.uid) return;

    const exists = !!this.currentUser.watchLater?.[movieId];

    try {
      if (exists) {
        await this.userService.removeFromWatchLater(this.currentUser.uid, movieId);
        delete this.currentUser.watchLater[movieId];
      } else {
        await this.userService.addToWatchLater(this.currentUser.uid, movieId);
        if (!this.currentUser.watchLater) this.currentUser.watchLater = {};
        this.currentUser.watchLater[movieId] = true;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async markAsSeen(movieId: string) {
    if (!this.currentUser || !this.currentUser.uid) return;

    const exists = !!this.currentUser.seen?.[movieId];

    try {
      if (exists) {
        await this.userService.removeFromSeen(this.currentUser.uid, movieId);
        delete this.currentUser.seen[movieId];
      } else {
        await this.userService.markAsSeen(this.currentUser.uid, movieId);
        if (!this.currentUser.seen) this.currentUser.seen = {};
        this.currentUser.seen[movieId] = true;
      }
    } catch (err) {
      console.error(err);
    }
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
