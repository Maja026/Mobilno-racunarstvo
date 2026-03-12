import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- dodaj
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; // <-- dodaj za eventualni routerLink
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../services/movie.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  standalone: true,
  imports: [
    CommonModule,   // <-- dodaj
    IonicModule,
    RouterModule    // <-- ako koristiš routerLink
  ],
})
export class MovieDetailsPage implements OnInit {

  movie?: Movie;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movieService.getMovie(id).subscribe(data => {
        this.movie = data;
        console.log('Movie details:', this.movie);
      });
    }
  }
}
