import {NgModule} from "@angular/core";
import {PostCreateComponent} from "./post-create/post-create.component";
import {PostListComponent} from "./post-list/post-list.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {AngularMaterialModule} from "../angular-material.module";

@NgModule({
    declarations: [PostCreateComponent, PostListComponent],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        AngularMaterialModule
    ]
})
export class PostsModule {
}
