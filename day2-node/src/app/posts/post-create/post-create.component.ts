import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Post} from '../post.model';
import {PostService} from '../post.service';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {mimeType} from "./mine-type.validator";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    constructor(public postService: PostService, public route: ActivatedRoute) {
    }

    @Output()
    postCreated = new EventEmitter<Post>();
    private mode: ContentMode = ContentMode.CREATE
    private postId: string;
    isLoading = false;
    post: Post;
    form: FormGroup;
    imagePreview: string;

    ngOnInit(): void {
        this.form = new FormGroup({
            title: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)]
            }),
            content: new FormControl(null, {
                validators: [Validators.required]
            }),
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        })

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
                        content: postData.content,
                        imagePath: postData.imagePath,
                        creator: postData.creator
                    }
                    this.form.setValue({
                        title: this.post.title,
                        content: this.post.content,
                        image: this.post.imagePath
                    })
                })
            } else {
                this.mode = ContentMode.CREATE;
                this.postId = null;
            }
        })
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get("image").updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => this.imagePreview = reader.result as string;
        reader.readAsDataURL(file);
    }

    onSavePost() {
        if (this.form.invalid) return;

        this.isLoading = true;
        if (this.mode === ContentMode.CREATE)
            this.postService.addPost(
                this.form.value.title,
                this.form.value.content,
                this.form.value.image);
        else
            this.postService.updatePost(
                this.postId,
                this.form.value.title,
                this.form.value.content,
                this.form.value.image)

        this.form.reset();
    }
}

enum ContentMode {
    CREATE,
    EDIT,
}
