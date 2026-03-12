import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { RatingService, Rating } from '../../services/rating.service';
import { Movie } from '../../services/movie.model';

// standalone imports za sve Ionic komponente koje koristimo
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonLabel, IonSelect, IonSelectOption, IonTextarea } from '@ionic/angular/standalone';

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

  ratingValue: number = 5;
  comment: string = '';

  constructor(
    private modalCtrl: ModalController,
    private ratingService: RatingService,
    private authService: AuthService
  ) {}

  async submitRating() {
    const userId = this.authService.getCurrentUserUid();
    if (!userId || !this.movie) return;

    const newRating: Rating = {
      userId,
      movieId: this.movie.id!,
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
