import {Post} from './post.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {
    }

    private apiUrl: string = "http://localhost:3000/api";

    getPosts() {
        console.log("getting postssssssss")
        this.http
            // should switch to using an object, define data structure
            .get<{ message: string; posts: any }>(this.apiUrl + "/posts")
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
        const post: Post = {id: null, title: title, content: content}
        this.http
            .post<{ message: string, postId: string }>(this.apiUrl + "/posts", post)
            .subscribe(responseData => {
                post.id = responseData.postId
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            })
    }

    deletePost(postId: string) {
        this.http
            .delete(this.apiUrl + "/posts/" + postId)
            .subscribe(() => {
                    const updatedPosts = this.posts.filter((post) => post.id !== postId)
                    this.posts = updatedPosts;
                    this.postsUpdated.next([...this.posts]);
                }
            );
    }
}
