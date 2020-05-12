import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Post} from '../post.model';
import {NgForm} from '@angular/forms';
import {PostService} from '../post.service';
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    constructor(public postService: PostService, public route: ActivatedRoute) {}

    @Output()
    postCreated = new EventEmitter<Post>();
    private mode: ContentMode = ContentMode.CREATE
    private postId: string;
    isLoading = false;
    post: Post;

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = ContentMode.EDIT;
                this.postId = paramMap.get('postId')
                this.isLoading = true;
                this.postService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content
                    }
                })
            } else {
                this.mode = ContentMode.CREATE;
                this.postId = null;
            }
        })
    }

    onSavePost(form: NgForm) {
        if (form.invalid) return;

        this.isLoading = true;
        if (this.mode === ContentMode.CREATE)
            this.postService.addPost(form.value.title, form.value.content);
        else
            this.postService.updatePost(this.postId, form.value.title, form.value.content)

        form.resetForm();
    }
}

enum ContentMode {
    CREATE,
    EDIT,
}
