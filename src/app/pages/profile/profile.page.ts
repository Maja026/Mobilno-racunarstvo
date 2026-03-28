import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../services/movie.model';
import { User } from '../../services/user.model';
import { RatingModalPage } from '../rating/rating-modal.page';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
  ]
})
export class ProfilePage implements OnInit {
  currentUser: User | null = null;
  watchLaterMovies: Movie[] = [];
  seenMovies: Movie[] = [];

  watchLaterFilter: 'movie' | 'series' = 'movie';
  seenFilter: 'movie' | 'series' = 'movie';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private movieService: MovieService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    await this.userService.createUserIfNotExists();

    this.userService.getUserData().subscribe(async (user: User | null) => {
      if (!user) return;
      this.currentUser = user;

      this.watchLaterMovies = [];
      this.seenMovies = [];

      const watchLaterIds = user.watchLater ? Object.keys(user.watchLater) : [];
      const seenIds = user.seen ? Object.keys(user.seen) : [];

      this.loadMovies(watchLaterIds, 'watchLater');
      this.loadMovies(seenIds, 'seen');
    });
  }

  private loadMovies(ids: string[], type: 'watchLater' | 'seen') {
    ids.forEach(id => {
      this.movieService.getMovie(id).subscribe(movie => {
        if (!movie) return;

        if (type === 'watchLater' && !this.watchLaterMovies.find(m => m.id === movie.id)) {
          this.watchLaterMovies.push(movie);
        }

        if (type === 'seen' && !this.seenMovies.find(m => m.id === movie.id)) {
          this.seenMovies.push(movie);
        }
      });
    });
  }

  goToDetails(movieId: string) {
    this.router.navigate(['/movie-details', movieId]);
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/login']));
  }

  removeFromWatchLater(movieId: string) {
    if (!this.currentUser) return;
    this.userService.removeFromWatchLater(movieId).then(() => {
      this.watchLaterMovies = this.watchLaterMovies.filter(m => m.id !== movieId);
    });
  }

  removeFromSeen(movieId: string) {
    if (!this.currentUser) return;
    this.userService.removeFromSeen(movieId).then(() => {
      this.seenMovies = this.seenMovies.filter(m => m.id !== movieId);
    });
  }

  setWatchLaterFilter(filter: 'movie' | 'series') {
    this.watchLaterFilter = filter;
  }

  setSeenFilter(filter: 'movie' | 'series') {
    this.seenFilter = filter;
  }

  get filteredWatchLater() {
    return this.watchLaterMovies.filter(m => m.type === this.watchLaterFilter);
  }

  get filteredSeen() {
    return this.seenMovies.filter(m => m.type === this.seenFilter);
  }

  async openRatingModal(movie: Movie) {
    const modal = await this.modalCtrl.create({
      component: RatingModalPage as any,
      componentProps: { movie }
    });
    await modal.present();
  }

  goBack() {
    this.router.navigate(['/movies']);
  }
}
