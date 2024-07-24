import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { LOCALSTORAGE_TOKEN_KEY } from '../../app.module';
import { AuthService } from '../../public/auth.service';
import { version } from '../../../../package.json';
import { Prescription } from '../../prescriptions/prescriptions.component';
import { Protocol } from '../../protocols/protocols/protocols.component';
import { PrescriptionService } from '../../prescriptions/prescriptions-service/prescriptions.service';
import { ProtocolsService } from '../../protocols/protocols.service';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    // get the app version from the package.json file
    protected readonly appVersion = version;
    protected user: string;
    protected sessionExpiry: string;
    protected prescriptions: Prescription[] = [];
    protected protocols: Protocol[] = [];
    protected showNotifications: boolean = true;
    protected date: FormControl = new FormControl();

    constructor(
        private router: Router,
        private authService: AuthService,
        private prescriptionService: PrescriptionService,
        private protocolsService: ProtocolsService,
    ) {
        this.user = this.authService.getLoggedInUser();
        this.sessionExpiry = this.expiresIn(this.authService.getTokenExpirationDate());
        this.prescriptions = this.prescriptionService.getAllPrescriptions();
        this.protocols = this.protocolsService.getAllProtocols();
    }

    ngOnInit() {
        this.prescriptionService.prescriptions$.subscribe((prescriptions) => {
			this.prescriptions = prescriptions.filter((prescription) => prescription.user === this.authService.getLoggedInUser());
		});
        this.protocolsService.protocols$.subscribe((protocols) => {
			this.protocols = protocols.filter((prescription) => prescription.user === this.authService.getLoggedInUser());
		});
    }

    ngOnChanges() {
        this.user = this.authService.getLoggedInUser();
    }

    protected expiresIn(expiryDate: Date | null): string {
        if (!expiryDate) {
            this.authService.logout();
            return 'Изтекла сесия!';
        }
        const now = new Date();
        const diff = expiryDate.getTime() - now.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const hoursStr = hours ? `${hours} часа, ` : '';
        const minutesStr = minutes % 60 ? `${minutes % 60} ${ minutes % 60 === 1 ? 'минута' : 'минути'}, ` : '';
        const days = Math.floor(hours / 24) ? `${Math.floor(hours / 24)} дни,` : '';
        return `${days} ${hoursStr} ${minutesStr} ${seconds % 60} сек`;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['../../']);
    }

    protected toggleNotifications(): void {
        this.showNotifications = !this.showNotifications;
    }

}
