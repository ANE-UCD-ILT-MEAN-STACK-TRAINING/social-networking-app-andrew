import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponent} from "./src/app/error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog) {
    }

    // intercepts any outgoing http requests
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = "An unknown error has occured."
                if (error.error.message)
                    errorMessage = error.error.message;
                this.dialog.open(ErrorComponent, {data: {message:errorMessage}});
                return throwError(error)
            })
        )
    }
}
