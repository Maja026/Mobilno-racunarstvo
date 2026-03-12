import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),

    // Firebase
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebaseConfig);
      console.log('Firebase app initialized:', app);
      return app;
    }),
    provideAuth(() => {
      const auth = getAuth();
      console.log('Auth initialized:', auth);
      return auth;
    }),
    provideFirestore(() => {
      const db = getFirestore();
      console.log('Firestore initialized:', db);
      return db;
    }),

    // Angular moduli
    importProvidersFrom(CommonModule, FormsModule, ReactiveFormsModule)
  ]
});

