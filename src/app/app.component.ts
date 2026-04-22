import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

import {
  IonApp,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonRouterOutlet
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonRouterOutlet
  ]
})
export class AppComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
