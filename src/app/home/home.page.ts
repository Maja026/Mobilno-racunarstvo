import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent],
})
export class HomePage {
  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    this.authService.logout()
      .then(() => {
        console.log('User logged out');
        this.router.navigate(['/login']); 
      })
      .catch((err: any) => {
        console.error(err);
        alert(err.message);
      });
  }
}
