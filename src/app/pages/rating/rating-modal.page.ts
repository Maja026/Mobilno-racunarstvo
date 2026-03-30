import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { RatingService, Rating } from '../../services/rating.service';
import { Movie } from '../../services/movie.model';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.page.html',
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
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea
  ]
})
export class RatingModalPage {
  @Input() movie!: Movie;

  ratingValue = 5;
  comment = '';

  constructor(
    private modalCtrl: ModalController,
    private ratingService: RatingService,
    private authService: AuthService
  ) {}

async submitRating() {
  const userId = await this.authService.getCurrentUserUid();
  if (!userId || !this.movie || !this.movie.id) return;

  const newRating: Rating = {
    userId,
    movieId: this.movie.id, 
    rating: this.ratingValue,
    comment: this.comment
  };

  await this.ratingService.addRating(newRating); 
  this.modalCtrl.dismiss();
}



  close() {
    this.modalCtrl.dismiss();
  }
}
