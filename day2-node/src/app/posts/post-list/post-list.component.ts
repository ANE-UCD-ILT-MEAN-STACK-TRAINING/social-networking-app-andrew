import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {PostService} from '../post.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  constructor(public postService: PostService) {
  }

  private postSubscription: Subscription;

  @Input() posts: Post[] = [];

  ngOnInit(): void {
    this.postService.getPosts();
    this.postSubscription = this.postService.getPostUpdateListener()
      .subscribe((postsReceived: Post[]) => this.posts = postsReceived);
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }

}
