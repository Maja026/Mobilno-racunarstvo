import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../services/movie.model';
import { User } from '../../services/user.model';

import { CommonModule } from '@angular/common';
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
  IonSegmentButton,
  ModalController
} from '@ionic/angular/standalone';
import { RatingModalPage } from '../rating/rating-modal.page'; // standalone modal

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
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

  ngOnInit() {
    const uid = this.authService.getCurrentUserUid();
    if (uid) {
      this.userService.getUserData(uid).subscribe(user => {
        this.currentUser = user;
        this.watchLaterMovies = [];
        this.seenMovies = [];

        this.mapMovies(user.watchLater, 'watchLater');
        this.mapMovies(user.seen, 'seen');
      });
    }
  }

  mapMovies(movieIds: string[], listType: 'watchLater' | 'seen') {
    movieIds.forEach(id => {
      this.movieService.getMovie(id).subscribe(movie => {
        if (movie) {
          if (listType === 'watchLater' && !this.watchLaterMovies.find(m => m.id === movie.id)) {
            this.watchLaterMovies.push(movie);
          }
          if (listType === 'seen' && !this.seenMovies.find(m => m.id === movie.id)) {
            this.seenMovies.push(movie);
          }
        }
      });
    });
  }

  goToDetails(movieId: string) {
    this.router.navigate(['/movie-details', movieId]);
  }

  logout() {
    this.authService.logout()
      .then(() => this.router.navigate(['/login']));
  }

  removeFromWatchLater(movieId: string) {
    if (!this.currentUser) return;
    this.userService.removeFromWatchLater(this.currentUser.uid, movieId)
      .then(() => {
        this.watchLaterMovies = this.watchLaterMovies.filter(m => m.id !== movieId);
      });
  }

  removeFromSeen(movieId: string) {
    if (!this.currentUser) return;
    this.userService.removeFromSeen(this.currentUser.uid, movieId)
      .then(() => {
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
      component: RatingModalPage,
      componentProps: { movie }
    });
    await modal.present();
  }
}
