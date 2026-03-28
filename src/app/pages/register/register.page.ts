import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
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
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
export class RegisterPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  register() {
    this.authService.register(this.email, this.password)
      .then(() => {
        console.log('User registered');
        this.router.navigate(['/movies']);
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

