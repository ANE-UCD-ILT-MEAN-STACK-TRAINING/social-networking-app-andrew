import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {AuthData} from "./auth-data.model";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class AuthService {

    private token: string;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private userUrl = environment.apiUrl + "/user"
    private tokenTimer: any;
    private userId: string;

    constructor(private http: HttpClient, private router: Router) {
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {email, password}
        console.log("authData: " + authData.email + ", " + authData.password)
        this.http.post(this.userUrl + "/signup", authData)
            .subscribe(() => this.router.navigate(["/"]),
                error => this.authStatusListener.next(false));
    }

    login(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        }
        this.http
            .post<{ token: string, expiresIn: any, userId: string }>
            (this.userUrl + "/login", authData)
            .subscribe(response => {
                    console.log(response)
                    const token = response.token
                    this.token = token

                    if (token) {
                        const expiresInDuration = response.expiresIn;
                        this.tokenTimer = setTimeout(() => this.logout(), expiresInDuration * 1000)
                        this.setAuthTimer(expiresInDuration);
                        this.isAuthenticated = true
                        this.userId = response.userId;
                        this.authStatusListener.next(true)

                        const now = new Date();
                        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                        console.log(expirationDate)
                        this.saveAuthData(token, expirationDate, this.userId);
                        this.router.navigate(['/']);
                    }
                },
                error => this.authStatusListener.next(false))
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false
        this.authStatusListener.next(false)
        this.userId = null;
        clearTimeout(this.tokenTimer)
        this.clearAuthData();
        this.router.navigate(['/'])
    }

    getToken() {
        return this.token;
    }

    getIsAuthenticated() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getUserId() {
        return this.userId;
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);

    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem("userId");
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expiration = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expiration) {
            return;
        }

        return {
            token: token,
            expirationDate: new Date(expiration),
            userId: userId
        }
    }

    autoAuthUser() {
        const authInfo = this.getAuthData();
        if (!authInfo)
            return;
        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

        if (expiresIn > 0) {
            this.token = authInfo.token
            this.isAuthenticated = true
            this.userId = authInfo.userId
            this.setAuthTimer(expiresIn / 1000)
        }
    }

    private setAuthTimer(durationInMs: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, durationInMs * 1000);
    }
}
