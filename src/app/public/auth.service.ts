import { LOCALSTORAGE_TOKEN_KEY } from './../app.module';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
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
    private apiUrl = 'http://localhost:3000/auth';

    constructor(
        private http: HttpClient,
        private snackbar: MatSnackBar,
        private jwtService: JwtHelperService
    ) { }

    login(loginRequest: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/sign-in`, loginRequest).pipe(
            tap((res: LoginResponse) => {
                return localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, res.accessToken)
            }),
            tap(() => this.snackbar.open('Login Successfull', 'Close', {
                duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
            }))
        );
    }

    /*
     The `..of()..` can be removed if you have a real backend, at the moment, this is just a faked response
    */
    register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
        console.log('registerRequest', registerRequest);

        return this.http.post<RegisterResponse>(`${this.apiUrl}/sign-up`, registerRequest).pipe(
            tap((res: RegisterResponse) => this.snackbar.open(`User created successfully`, 'Close', {
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
