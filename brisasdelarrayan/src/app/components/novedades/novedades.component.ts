import { Component } from '@angular/core';
import { FacebookPostsComponent } from '../facebook-posts/facebook-posts.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [FacebookPostsComponent, NgFor],
  templateUrl: './novedades.component.html',
  styleUrl: './novedades.component.scss'
})
export class NovedadesComponent {

}
