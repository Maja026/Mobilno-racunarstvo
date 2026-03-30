import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { RatingService, Rating } from '../../services/rating.service';
import { Movie } from '../../services/movie.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class MovieDetailsPage implements OnInit {

  movie?: Movie;
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

  const movie = await this.movieService.getMovie(id);
  if (movie) {
    this.movie = movie;
  }

  const ratings = await this.ratingService.getRatingsForMovie(id);
  if (ratings) {
    this.ratings = ratings;
    if (ratings.length > 0) {
      this.averageRating = ratings
        .map(r => r.rating)
        .reduce((a, b) => a + b, 0) / ratings.length;
    }
  }
}


  goBack() {
    this.location.back();
  }
}
