import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.page.html',
  styleUrls: ['./add-movie.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AddMoviePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
