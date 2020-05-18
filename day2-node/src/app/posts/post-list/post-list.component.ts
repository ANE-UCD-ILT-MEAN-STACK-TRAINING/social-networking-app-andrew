import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {PostService} from '../post.service';
import {Subscription} from 'rxjs';
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

    constructor(public postService: PostService, private authService: AuthService) {
    }

    private postSubscription: Subscription;
    isLoading = false;
    @Input()
    posts: Post[] = [];
    totalPosts = 10;
    postsPerPage = 5
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10]
    private authStatusSub: Subscription;
    userIsAuthenticated = false;

    ngOnInit(){
        this.isLoading = true;
        this.postService.getPosts(this.postsPerPage, 1);
        this.postSubscription = this.postService.getPostUpdateListener()
            .subscribe((postData: {posts: Post[], postCount: number}) => {
                setTimeout(()=>{ this.isLoading = false }, 2000);
                this.posts = postData.posts;
                this.totalPosts= postData.postCount;
            });

        this.userIsAuthenticated = this.authService.getIsAuthenticated();

        this.authStatusSub = this.authService.getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            });
    }

    ngOnDestroy() {
        this.postSubscription.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

    onDelete(postId: string) {
        this.isLoading = true;
        this.postService.deletePost(postId)
            .subscribe(() => {
                this.postService.getPosts(this.postsPerPage, this.currentPage);
            });
    }

    onPageChange(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex;
        this.postsPerPage = pageData.pageSize;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
    }

}
