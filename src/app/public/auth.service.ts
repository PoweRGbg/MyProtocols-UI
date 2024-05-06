import { LOCALSTORAGE_TOKEN_KEY } from './../app.module';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './interfaces';

export const fakeLoginResponse: LoginResponse = {
    // fakeAccessToken.....should all come from real backend
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    refreshToken: {
        id: 1,
        userId: 2,
        token: 'fakeRefreshToken...should al come from real backend',
        refreshCount: 2,
        expiryDate: new Date(),
    },
    tokenType: 'JWT'
}

export const fakeRegisterResponse: RegisterResponse = {
    status: 200,
    message: 'Registration sucessfull.'
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://protocols.nightscout.bg/api/auth';

    constructor(
        private http: HttpClient,
        private snackbar: MatSnackBar,
        private jwtService: JwtHelperService
    ) { }

    login(loginRequest: LoginRequest): Observable<LoginResponse> {
        // I want to catch if the respone is error, so I can show a snackbar message
        return this.http.post<LoginResponse>(`${this.apiUrl}/sign-in`, loginRequest).pipe(
            tap((res: LoginResponse) => {
                if ((res as any as HttpErrorResponse).error) {
                   
                } else 
                return localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, res.accessToken)
            }),
            tap(() => this.snackbar.open('Успешно влизане', 'Затвори', {
                duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
            })),
            catchError((err) => {
                this.snackbar.open('Грешка при влизане', 'Затвори', {
                    duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
                });
                return of(err);
            })
        );
    }

    logout() {
        // Removes the jwt token from the local storage, so the user gets logged out & then navigate back to the "public" routes
        localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
    }

    /*
     The `..of()..` can be removed if you have a real backend, at the moment, this is just a faked response
    */
    register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.apiUrl}/sign-up`, registerRequest).pipe(
            tap((res: RegisterResponse) => this.snackbar.open(`Потребителят е създаден`, 'Затвори', {
                duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
            }))
        )
    }

    /*
     Get the user fromt the token payload
     */
    getLoggedInUser(): string {
        const decodedToken = this.jwtService.decodeToken();
        return decodedToken.email;
    }

    getTokenExpirationDate(): Date | null{
        const decodedToken = this.jwtService.decodeToken();
        if (decodedToken.exp === undefined) return null;
        const date = new Date(0);
        date.setUTCSeconds(decodedToken.exp);
        return date;
    }
}
