import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PostListComponent} from "./posts/post-list/post-list.component";

const routes: Routes = [
    {path: '', component: PostListComponent},
    {path: 'create', component: PostListComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
