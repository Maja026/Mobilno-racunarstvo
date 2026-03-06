import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // <-- obavezno import
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    FormsModule,
  ],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  // <-- ubaci authService u konstruktor
  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        console.log('User logged in');
        this.router.navigate(['/movies']); // ide na movies stranicu posle login-a
      })
      .catch((err: any) => { // <-- TS ne voli implicit any
        console.error(err);
        alert(err.message);
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
