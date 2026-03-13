import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
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
  movie?: Movie;
  ratings: Rating[] = [];
  averageRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private ratingService: RatingService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movieService.getMovie(id).subscribe(data => {
        this.movie = data;
        console.log('Movie details:', this.movie);
      });

      // Dohvati ocene za film
      this.loadRatings(id);
    }
  }

  async loadRatings(movieId: string) {
    this.ratings = await this.ratingService.getRatingsForMovie(movieId);
    if (this.ratings.length > 0) {
      const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
      this.averageRating = sum / this.ratings.length;
    } else {
      this.averageRating = 0;
    }
  }
}
