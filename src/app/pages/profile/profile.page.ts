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
  imports: [CommonModule, FormsModule, IonicModule],
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
    const uid = await this.authService.getCurrentUserUid();
    const email = await this.authService.getCurrentUserEmail();
    if (!uid || !email) return;

    
    await this.userService.createUserIfNotExists(uid, email);

    
    const user = await this.userService.getUserData(uid);
    if (!user) return;

    this.currentUser = user;

    const watchLaterIds = user.watchLater ? Object.keys(user.watchLater) : [];
    const seenIds = user.seen ? Object.keys(user.seen) : [];

    await this.loadMovies(watchLaterIds, 'watchLater');
    await this.loadMovies(seenIds, 'seen');
  }

  private async loadMovies(ids: string[], type: 'watchLater' | 'seen') {
    for (const id of ids) {
      const movie = await this.movieService.getMovie(id);
      if (!movie) continue;

      if (type === 'watchLater' && !this.watchLaterMovies.find(m => m.id === movie.id)) {
        this.watchLaterMovies.push(movie);
      }

      if (type === 'seen' && !this.seenMovies.find(m => m.id === movie.id)) {
        this.seenMovies.push(movie);
      }
    }
  }

  goToDetails(movieId: string) {
    this.router.navigate(['/movie-details', movieId]);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

async removeFromWatchLater(movieId: string) {
  if (!this.currentUser || !this.currentUser.uid) return; 
  await this.userService.removeFromWatchLater(this.currentUser.uid, movieId);
  this.watchLaterMovies = this.watchLaterMovies.filter(m => m.id !== movieId);
}

async removeFromSeen(movieId: string) {
  if (!this.currentUser || !this.currentUser.uid) return; 
  await this.userService.removeFromSeen(this.currentUser.uid, movieId);
  this.seenMovies = this.seenMovies.filter(m => m.id !== movieId);
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
