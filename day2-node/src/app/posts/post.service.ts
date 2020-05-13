import {Post} from './post.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {
    }

    private apiUrl: string = "http://localhost:3000/api";
    private postsUrl: string = this.apiUrl + "/posts/"

    // get single
    getPost(id: string) {
        return this.http
            .get<{ _id: string, title: string, content: string }>(this.postsUrl + id)
    }

    // get all
    getPosts() {
        this.http
            // should switch to using an object, define data structure
            .get<{ message: string; posts: any }>(this.postsUrl)
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    };
                });
            }))
            .subscribe(transformedPosts => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            })
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);

        this.http
            .post<{ message: string, post: Post }>(this.postsUrl, postData)
            .subscribe(responseData => {
                const post: Post = {
                    id: responseData.post.id,
                    title: title,
                    content: content,
                    imagePath: responseData.post.imagePath
                }
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            })
    }

    updatePost(
        id: string, title: string, content: string) {
        const post: Post = {id: id, title: title, content: content}

        this.http.put<{ message: string, postId: string }>(this.postsUrl + id, post)
            .subscribe(responseData => {
                console.log(responseData)
                const updatedPosts = [...this.posts]
                const oldPostIndex = updatedPosts.findIndex(p => p.id == post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts])
                this.router.navigate(['/']);
            })
    }

    deletePost(postId: string) {
        this.http
            .delete(this.postsUrl + postId)
            .subscribe(() => {
                    const updatedPosts = this.posts.filter((post) => post.id !== postId)
                    this.posts = updatedPosts;
                    this.postsUpdated.next([...this.posts]);
                }
            );
    }
}
