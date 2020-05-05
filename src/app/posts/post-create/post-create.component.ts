import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Post} from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  constructor() {
  }

  @Output() postCreated = new EventEmitter<Post>();
  enteredTitle = '';
  enteredContent = '';

  ngOnInit(): void {
  }

  onAddPost() {
    const post: Post = {
      title: this.enteredTitle,
      content: this.enteredContent
    };
    this.postCreated.emit(post);
  }

}
