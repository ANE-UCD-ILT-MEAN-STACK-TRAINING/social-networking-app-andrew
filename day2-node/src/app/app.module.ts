import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './header/header/header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./auth/auth-interceptor";
import {AngularMaterialModule} from "./angular-material.module";
import {PostsModule} from "./posts/posts.module";
import {ErrorInterceptor} from "../../error-interceptor";
import { ErrorComponent } from './error/error.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ErrorComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AngularMaterialModule,
        PostsModule,
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ],
    bootstrap: [AppComponent],
    entryComponents: [ErrorComponent] // TODO angular says this is no longer necessary
})
export class AppModule {
}
