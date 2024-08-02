import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { FacebookService } from '../../shared/services/facebook.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-facebook-posts',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './facebook-posts.component.html',
  styleUrl: './facebook-posts.component.scss'
})
export class FacebookPostsComponent implements OnInit, OnDestroy {
  posts: any;
  private updateSubscription: Subscription | undefined;

  constructor(private facebookService: FacebookService) {}

  ngOnInit(): void {
    this.facebookService.getPosts().subscribe(data => {
    this.posts = data;
    });
    this.loadPosts();
    this.updateSubscription = interval(60000).subscribe(() => this.loadPosts()); // Actualiza cada minuto
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  private loadPosts(): void {
    this.facebookService.getPosts().subscribe(data => {
      this.posts = data;
    });
  }
}
