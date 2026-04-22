import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MovieService } from '../../services/movie.service';
import { RatingService, Rating } from '../../services/rating.service';
import { Movie } from '../../services/movie.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class MovieDetailsPage implements OnInit {

  movie: Movie | null = null;

  ratings: Rating[] = [];
  averageRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private ratingService: RatingService,
    private location: Location
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;


    this.movie = await this.movieService.getMovie(id);

  
    const allRatings = await this.ratingService.getAllRatings();

    this.ratings = allRatings.filter((r: Rating) => r.movieId === id);


    if (this.ratings.length > 0) {
      const sum = this.ratings
        .map((r: Rating) => r.rating)
        .reduce((a: number, b: number) => a + b, 0);

      this.averageRating = sum / this.ratings.length;
    } else {
      this.averageRating = 0;
    }
  }

  goBack() {
    this.location.back();
  }
}
