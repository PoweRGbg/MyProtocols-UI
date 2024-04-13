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
    protected user: string;
    protected sessionExpiry: string;
    constructor(
        private router: Router,
        private authService: AuthService,
    ) {
        this.user = this.authService.getLoggedInUser();
        this.sessionExpiry = this.expiresIn(this.authService.getTokenExpirationDate());
    }

    ngOnChanges() {
        this.user = this.authService.getLoggedInUser();
    }

    protected expiresIn(expiryDate: Date | null): string {
        if (!expiryDate) {
            return 'Expired';
        }
        const now = new Date();
        const diff = expiryDate.getTime() - now.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const hoursStr = hours ? `${hours} hours, ` : '';
        const minutesStr = minutes % 60 ? `${minutes % 60} minutes, ` : '';
        const days = Math.floor(hours / 24) ? `${Math.floor(hours / 24)} days,` : '';
        return `${days} ${hoursStr} ${minutesStr} ${seconds % 60} seconds`;
    }

    logout() {
        // Removes the jwt token from the local storage, so the user gets logged out & then navigate back to the "public" routes
        localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
        this.router.navigate(['../../']);
    }

}
