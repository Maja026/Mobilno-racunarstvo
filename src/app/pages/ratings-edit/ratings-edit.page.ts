import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { RatingService, Rating } from '../../services/rating.service';
import { MovieService, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-ratings-edit',
  standalone: true,
  templateUrl: './ratings-edit.page.html',
  styleUrls: ['./ratings-edit.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class RatingsEditPage implements OnInit {

  ratings: Rating[] = [];
  moviesMap: { [key: string]: Movie } = {};

  constructor(
    private authService: AuthService,
    private ratingService: RatingService,
    private movieService: MovieService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.loadRatings();
  }

  async loadRatings() {
    const uid = await this.authService.getCurrentUserUid();
    if (!uid) return;

    const allRatings = await this.ratingService.getAllRatings();

    this.ratings = allRatings.filter(r => r.userId === uid);

    for (const r of this.ratings) {
      if (!this.moviesMap[r.movieId]) {
        const movie = await this.movieService.getMovie(r.movieId);
        if (movie) this.moviesMap[r.movieId] = movie;
      }
    }
  }

  async editRating(rating: Rating) {
    const alert = await this.alertCtrl.create({
      header: 'Edit Rating',
      inputs: [
        {
          name: 'rating',
          type: 'number',
          value: rating.rating,
          min: 1,
          max: 10
        },
        {
          name: 'comment',
          type: 'text',
          value: rating.comment
        }
      ],
      buttons: [
        'Cancel',
        {
          text: 'Save',
          handler: async (data) => {

            await this.ratingService.updateRating(rating.id!, {
              ...rating,
              rating: Number(data.rating),
              comment: data.comment
            });

            await this.loadRatings();
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteRating(rating: Rating) {
    const confirm = await this.alertCtrl.create({
      header: 'Delete rating?',
      buttons: [
        'Cancel',
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {

            await this.ratingService.deleteRating(rating.id!);

            await this.loadRatings();
          }
        }
      ]
    });

    await confirm.present();
  }
}