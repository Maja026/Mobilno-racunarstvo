import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
  path: 'movies',
  loadComponent: () =>
    import('./pages/movies/movies.page').then((m) => m.MoviesPage)
}
,
  {
    path: 'movie-details/:id',
    loadComponent: () =>
      import('./pages/movie-details/movie-details.page').then(
        (m) => m.MovieDetailsPage
      ),
  },
  {
    path: 'add-movie',
    loadComponent: () =>
      import('./pages/add-movie/add-movie.page').then((m) => m.AddMoviePage),
  },
  {
  path: 'profile',
  loadComponent: () =>
    import('./pages/profile/profile.page').then((m) => m.ProfilePage)
},


];
