import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LOCALSTORAGE_TOKEN_KEY } from '../../app.module';
import { AuthService } from '../../public/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    protected readonly user: string;
    constructor(
        private router: Router,
        private authService: AuthService,
    ) {
        this.user = this.authService.getLoggedInUser();
    }

    logout() {
        // Removes the jwt token from the local storage, so the user gets logged out & then navigate back to the "public" routes
        localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
        this.router.navigate(['../../']);
    }

}
